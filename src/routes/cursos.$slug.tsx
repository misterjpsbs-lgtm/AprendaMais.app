import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/SiteLayout";
import { categoriesQuery, coursesQuery, formatPrice, isSafeUrl, trackEvent } from "@/lib/store";

export const Route = createFileRoute("/cursos/$slug")({
  head: () => ({
    meta: [
      { title: "Detalhes do curso — AprendaMais" },
      { name: "description", content: "Veja os detalhes do curso e compre com segurança na Hotmart." },
      { property: "og:title", content: "Detalhes do curso — AprendaMais" },
      { property: "og:description", content: "Veja os detalhes do curso e compre com segurança na Hotmart." },
    ],
  }),
  component: CourseDetail,
});

function CourseDetail() {
  const { slug } = Route.useParams();
  const { data: courses, isLoading } = useQuery(coursesQuery);
  const { data: cats = [] } = useQuery(categoriesQuery);
  const course = courses?.find((c) => c.slug === slug);
  const cat = cats.find((c) => c.id === course?.category_id);

  if (isLoading) return <PageShell><p className="mx-auto max-w-6xl px-4 py-16 text-muted-foreground">Carregando…</p></PageShell>;
  if (!course)
    return (
      <PageShell>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-3xl font-semibold">Curso não encontrado</h1>
          <Link to="/cursos" search={{ q: undefined, categoria: undefined }} className="mt-4 inline-block text-primary">← Voltar ao catálogo</Link>
        </div>
      </PageShell>
    );

  const hasLink = isSafeUrl(course.affiliate_url);
  const price = formatPrice(course.price);

  return (
    <PageShell>
      <article className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
        <title>{`${course.title} — AprendaMais`}</title>
        <div className="aspect-video overflow-hidden rounded-2xl bg-secondary">
          {course.image_url ? (
            <img src={course.image_url} alt={course.title} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-primary/40"><BookOpen className="h-16 w-16" aria-hidden /></div>
          )}
        </div>
        <div>
          <Link to="/cursos" search={{ q: undefined, categoria: undefined }} className="text-sm text-muted-foreground">← Catálogo</Link>
          {cat && <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">{cat.name}</p>}
          <h1 className="mt-1 text-3xl font-semibold md:text-4xl">{course.title}</h1>
          {course.is_demo && (
            <p className="mt-3 rounded-lg bg-accent/40 px-3 py-2 text-sm">Este é um curso de demonstração, sem link de compra.</p>
          )}
          {price && <p className="mt-5 text-2xl font-semibold">{price}</p>}
          {hasLink ? (
            <a
              href={course.affiliate_url!}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => trackEvent("click", { courseId: course.id, path: `/cursos/${course.slug}` })}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground transition hover:bg-brand sm:w-auto"
            >
              Comprar na Hotmart <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          ) : (
            <button disabled className="mt-6 w-full cursor-not-allowed rounded-full bg-muted px-6 py-4 font-semibold text-muted-foreground sm:w-auto">
              Link de compra indisponível
            </button>
          )}
          <p className="mt-3 text-xs text-muted-foreground">A compra e o acesso ao curso acontecem na Hotmart ou na plataforma oficial do produtor.</p>
          {course.description && <div className="mt-8 whitespace-pre-line leading-relaxed text-foreground/90">{course.description}</div>}
        </div>
      </article>
    </PageShell>
  );
}
