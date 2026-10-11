import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/SiteLayout";
import { CourseCard } from "@/components/CourseCard";
import { categoriesQuery, coursesQuery } from "@/lib/store";

type Search = { q?: string | undefined; categoria?: string | undefined };

export const Route = createFileRoute("/cursos/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
    categoria: typeof s.categoria === "string" && s.categoria ? s.categoria : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Catálogo de cursos — AprendaMais" },
      { name: "description", content: "Pesquise e filtre cursos digitais por categoria." },
      { property: "og:title", content: "Catálogo de cursos — AprendaMais" },
      { property: "og:description", content: "Pesquise e filtre cursos digitais por categoria." },
    ],
  }),
  component: Catalog,
});

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function Catalog() {
  const { q, categoria } = Route.useSearch();
  const navigate = useNavigate({ from: "/cursos/" });
  const { data: cats = [] } = useQuery(categoriesQuery);
  const { data: courses = [], isLoading } = useQuery(coursesQuery);
  const cat = cats.find((c) => c.slug === categoria);
  const term = q ? norm(q) : "";
  const list = courses.filter(
    (c) =>
      (!cat || c.category_id === cat.id) &&
      (!term || norm(`${c.title} ${c.short_description ?? ""}`).includes(term)),
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-semibold">Cursos</h1>
        <input
          type="search"
          defaultValue={q ?? ""}
          onChange={(e) => navigate({ search: (p) => ({ ...p, q: e.target.value || undefined }), replace: true })}
          placeholder="Pesquisar por nome ou assunto"
          aria-label="Pesquisar cursos"
          className="mt-6 h-12 w-full rounded-full border bg-card px-5 outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
          <Link search={(p: Search) => ({ ...p, categoria: undefined })} to="/cursos" className={`rounded-full border px-4 py-1.5 text-sm ${!cat ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>Todas</Link>
          {cats.map((c) => (
            <Link key={c.id} to="/cursos" search={(p: Search) => ({ ...p, categoria: c.slug })} className={`rounded-full border px-4 py-1.5 text-sm ${cat?.id === c.id ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>
              {c.name}
            </Link>
          ))}
        </div>
        {isLoading ? (
          <p className="mt-8 text-muted-foreground">Carregando…</p>
        ) : list.length === 0 ? (
          <p className="mt-8 text-muted-foreground">Nenhum curso encontrado.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => <CourseCard key={c.id} course={c} categoryName={cats.find((x) => x.id === c.category_id)?.name} />)}
          </div>
        )}
      </div>
    </PageShell>
  );
}
