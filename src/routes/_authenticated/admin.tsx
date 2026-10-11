import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { categoriesQuery, coursesQuery, isSafeUrl, type Course } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — AprendaMais" },
      { name: "description", content: "Gerencie cursos e categorias." },
      { property: "og:title", content: "Painel administrativo — AprendaMais" },
      { property: "og:description", content: "Gerencie cursos e categorias." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const input = "mt-1 h-10 w-full rounded-lg border bg-card px-3 text-sm";

function Admin() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    },
  });
  const { data: cats = [] } = useQuery(categoriesQuery);
  const { data: courses = [] } = useQuery(coursesQuery);
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 864e5).toISOString();
      const [v, c] = await Promise.all([
        supabase.from("events").select("id", { count: "exact", head: true }).eq("type", "view").gte("created_at", since),
        supabase.from("events").select("course_id").eq("type", "click").gte("created_at", since).limit(5000),
      ]);
      const perCourse: Record<string, number> = {};
      (c.data ?? []).forEach((e) => { if (e.course_id) perCourse[e.course_id] = (perCourse[e.course_id] ?? 0) + 1; });
      return { views: v.count ?? 0, clicks: c.data?.length ?? 0, perCourse };
    },
  });
  const [editing, setEditing] = useState<Partial<Course> | null>(null);
  const [newCat, setNewCat] = useState("");

  const signOut = async () => {
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
  const refresh = () => qc.invalidateQueries();

  if (isLoading) return <p className="p-8">Carregando…</p>;
  if (!isAdmin)
    return (
      <div className="p-8">
        <p>Sua conta não tem acesso de administrador.</p>
        <button onClick={signOut} className="mt-4 text-primary">Sair</button>
      </div>
    );

  const saveCourse = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing?.title) return;
    if (editing.affiliate_url && !isSafeUrl(editing.affiliate_url)) return toast.error("O link de afiliado deve começar com https://");
    if (editing.image_url && !isSafeUrl(editing.image_url)) return toast.error("A URL da imagem deve começar com https://");
    const row = {
      title: editing.title,
      slug: editing.slug || slugify(editing.title),
      short_description: editing.short_description || null,
      description: editing.description || null,
      image_url: editing.image_url || null,
      price: editing.price === undefined || editing.price === null || (editing.price as unknown) === "" ? null : Number(editing.price),
      affiliate_url: editing.affiliate_url || null,
      category_id: editing.category_id || null,
      featured: !!editing.featured,
      published: editing.published ?? true,
      is_demo: false,
    };
    const { error } = editing.id
      ? await supabase.from("courses").update(row).eq("id", editing.id)
      : await supabase.from("courses").insert(row);
    if (error) return toast.error(error.message);
    toast.success("Curso salvo");
    setEditing(null);
    refresh();
  };

  const del = async (id: string) => {
    if (!confirm("Remover este curso?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const addCat = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    const { error } = await supabase.from("categories").insert({ name: newCat.trim(), slug: slugify(newCat), sort_order: cats.length + 1 });
    if (error) return toast.error(error.message);
    setNewCat("");
    refresh();
  };
  const renameCat = async (id: string, name: string) => {
    const n = prompt("Novo nome da categoria", name);
    if (!n) return;
    const { error } = await supabase.from("categories").update({ name: n }).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };
  const delCat = async (id: string) => {
    if (!confirm("Remover categoria? Os cursos ficarão sem categoria.")) return;
    await supabase.from("categories").delete().eq("id", id);
    refresh();
  };

  const set = (k: keyof Course, v: unknown) => setEditing((p) => ({ ...p, [k]: v }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Painel AprendaMais</h1>
        <div className="flex gap-4 text-sm">
          <Link to="/" className="text-primary">Ver loja</Link>
          <button onClick={signOut} className="text-muted-foreground">Sair</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">Visitas (30 dias)</p><p className="text-2xl font-semibold">{stats?.views ?? "–"}</p></div>
        <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">Cliques em comprar (30 dias)</p><p className="text-2xl font-semibold">{stats?.clicks ?? "–"}</p></div>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Cursos</h2>
          <button onClick={() => setEditing({ published: true })} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">+ Novo curso</button>
        </div>

        {editing && (
          <form onSubmit={saveCourse} className="mt-4 grid gap-4 rounded-xl border bg-card p-5 md:grid-cols-2">
            <label className="text-sm font-medium md:col-span-2">Título*<input required className={input} value={editing.title ?? ""} onChange={(e) => set("title", e.target.value)} /></label>
            <label className="text-sm font-medium">Categoria
              <select className={input} value={editing.category_id ?? ""} onChange={(e) => set("category_id", e.target.value)}>
                <option value="">Sem categoria</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium">Preço (R$, opcional)<input type="number" step="0.01" min="0" className={input} value={editing.price ?? ""} onChange={(e) => set("price", e.target.value)} /></label>
            <label className="text-sm font-medium md:col-span-2">Link de afiliado Hotmart (https://…)<input className={input} value={editing.affiliate_url ?? ""} onChange={(e) => set("affiliate_url", e.target.value)} /></label>
            <label className="text-sm font-medium md:col-span-2">URL da imagem (https://…)<input className={input} value={editing.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} /></label>
            <label className="text-sm font-medium md:col-span-2">Resumo<input className={input} value={editing.short_description ?? ""} onChange={(e) => set("short_description", e.target.value)} /></label>
            <label className="text-sm font-medium md:col-span-2">Descrição<textarea rows={5} className="mt-1 w-full rounded-lg border bg-card p-3 text-sm" value={editing.description ?? ""} onChange={(e) => set("description", e.target.value)} /></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.featured} onChange={(e) => set("featured", e.target.checked)} /> Destaque na página inicial</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published ?? true} onChange={(e) => set("published", e.target.checked)} /> Publicado</label>
            <div className="flex gap-3 md:col-span-2">
              <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Salvar</button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-full border px-5 py-2 text-sm">Cancelar</button>
            </div>
          </form>
        )}

        <div className="mt-4 divide-y rounded-xl border bg-card">
          {courses.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-muted-foreground">
                  {cats.find((x) => x.id === c.category_id)?.name ?? "Sem categoria"} · {c.published ? "Publicado" : "Rascunho"} · {c.affiliate_url ? "com link" : "sem link"} · {stats?.perCourse[c.id] ?? 0} cliques
                </p>
              </div>
              <button onClick={() => setEditing(c)} className="text-sm text-primary">Editar</button>
              <button onClick={() => del(c.id)} className="text-sm text-destructive">Remover</button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Categorias</h2>
        <form onSubmit={addCat} className="mt-4 flex gap-2">
          <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Nova categoria" aria-label="Nova categoria" className={input + " mt-0 max-w-xs"} />
          <button className="rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground">Adicionar</button>
        </form>
        <div className="mt-4 divide-y rounded-xl border bg-card">
          {cats.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3">
              <span className="flex-1">{c.name}</span>
              <button onClick={() => renameCat(c.id, c.name)} className="text-sm text-primary">Renomear</button>
              <button onClick={() => delCat(c.id)} className="text-sm text-destructive">Remover</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
