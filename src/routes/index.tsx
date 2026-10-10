import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Bot, Rocket, PiggyBank, Sprout, Briefcase, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/SiteLayout";
import { CourseCard } from "@/components/CourseCard";
import { categoriesQuery, coursesQuery } from "@/lib/store";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AprendaMais — Conhecimento que abre caminhos" },
      { name: "description", content: "Encontre cursos digitais de Marketing, Inteligência Artificial, Empreendedorismo, Finanças e mais." },
      { property: "og:title", content: "AprendaMais — Conhecimento que abre caminhos" },
      { property: "og:description", content: "Cursos digitais selecionados para você crescer pessoal e profissionalmente." },
    ],
  }),
  component: Index,
});

const icons: Record<string, typeof Megaphone> = {
  "marketing-digital": Megaphone,
  "inteligencia-artificial": Bot,
  empreendedorismo: Rocket,
  financas: PiggyBank,
  "desenvolvimento-pessoal": Sprout,
  profissoes: Briefcase,
};

function Index() {
  const { data: cats = [] } = useQuery(categoriesQuery);
  const { data: courses = [], isLoading } = useQuery(coursesQuery);
  const featured = courses.filter((c) => c.featured).slice(0, 6);
  const catName = (id: string | null) => cats.find((c) => c.id === id)?.name;

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-brand text-brand-foreground">
        <img src={hero} alt="" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover opacity-30" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/90 to-brand/30" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-leaf">AprendaMais</p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight md:text-6xl">Conhecimento que abre caminhos</h1>
          <p className="mt-5 max-w-lg text-lg opacity-85">Cursos digitais selecionados para você aprender novas habilidades e crescer no seu ritmo.</p>
          <Link to="/cursos" search={{ q: undefined, categoria: undefined }} className="mt-8 inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 font-semibold text-brand transition hover:brightness-105">
            Explorar cursos <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="cat-title">
        <h2 id="cat-title" className="text-3xl font-semibold">Categorias</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {cats.map((c) => {
            const Icon = icons[c.slug] ?? Sprout;
            return (
              <Link key={c.id} to="/cursos" search={{ categoria: c.slug, q: undefined }} className="flex flex-col items-start gap-3 rounded-xl border bg-card p-4 transition hover:border-primary hover:bg-secondary">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary"><Icon className="h-5 w-5" aria-hidden /></span>
                <span className="text-sm font-semibold">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4" aria-labelledby="feat-title">
        <div className="flex items-end justify-between">
          <h2 id="feat-title" className="text-3xl font-semibold">Cursos em destaque</h2>
          <Link to="/cursos" search={{ q: undefined, categoria: undefined }} className="text-sm font-semibold text-primary">Ver todos →</Link>
        </div>
        {isLoading ? (
          <p className="mt-6 text-muted-foreground">Carregando…</p>
        ) : featured.length === 0 ? (
          <p className="mt-6 text-muted-foreground">Nenhum curso em destaque no momento.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => <CourseCard key={c.id} course={c} categoryName={catName(c.category_id)} />)}
          </div>
        )}
      </section>
    </PageShell>
  );
}
