import type { ReactNode } from "react";
import { PageShell } from "@/components/SiteLayout";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <div className="mt-8 space-y-4 leading-relaxed text-foreground/90 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold">
          {children}
        </div>
      </div>
    </PageShell>
  );
}
