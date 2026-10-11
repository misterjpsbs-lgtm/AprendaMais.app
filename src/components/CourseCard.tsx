import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { formatPrice, type Course } from "@/lib/store";

export function CourseCard({ course, categoryName }: { course: Course; categoryName?: string | undefined }) {
  const price = formatPrice(course.price);
  return (
    <Link
      to="/cursos/$slug"
      params={{ slug: course.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-video bg-secondary">
        {course.image_url ? (
          <img src={course.image_url} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-primary/40">
            <BookOpen className="h-12 w-12" aria-hidden />
          </div>
        )}
        {course.is_demo && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
            Demonstração
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {categoryName && <p className="text-xs font-semibold uppercase tracking-wide text-primary">{categoryName}</p>}
        <h3 className="mt-1 text-lg font-semibold leading-snug group-hover:text-primary">{course.title}</h3>
        {course.short_description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.short_description}</p>
        )}
        <div className="mt-auto pt-4 text-sm font-semibold">{price ?? <span className="text-muted-foreground">Ver detalhes →</span>}</div>
      </div>
    </Link>
  );
}
