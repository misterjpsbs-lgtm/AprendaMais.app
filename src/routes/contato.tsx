import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — AprendaMais" },
      { name: "description", content: "Fale com a equipe AprendaMais." },
      { property: "og:title", content: "Contato — AprendaMais" },
      { property: "og:description", content: "Fale com a equipe AprendaMais." },
    ],
  }),
  component: () => (
    <LegalPage title="Contato">
      <p>Tem dúvidas sobre algum curso indicado aqui? Fale com a gente.</p>
      <p className="rounded-lg border bg-card p-4">
        E-mail: <strong>[cadastre aqui seu e-mail de contato]</strong>
      </p>
      <h2>Dúvidas sobre compras e acesso</h2>
      <p>
        Pagamentos, reembolsos e acesso às aulas são de responsabilidade da Hotmart e do produtor de cada
        curso. Para esses assuntos, utilize o suporte da Hotmart ou do produtor.
      </p>
    </LegalPage>
  ),
});
