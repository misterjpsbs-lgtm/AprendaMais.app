import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de uso — AprendaMais" },
      { name: "description", content: "Condições de uso da loja AprendaMais." },
      { property: "og:title", content: "Termos de uso — AprendaMais" },
      { property: "og:description", content: "Condições de uso da loja AprendaMais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LegalPage title="Termos de uso">
      <p>Ao utilizar a AprendaMais, você concorda com os termos abaixo.</p>
      <h2>Natureza do site</h2>
      <p>
        A AprendaMais é uma vitrine de divulgação de cursos digitais de terceiros. Não vendemos, não processamos
        pagamentos e não entregamos cursos. Compras e acesso acontecem na Hotmart ou na plataforma oficial do produtor.
      </p>
      <h2>Informações dos cursos</h2>
      <p>
        Descrições e preços podem mudar sem aviso. Sempre confirme as condições finais na página de compra oficial.
        Cursos marcados como “Demonstração” são fictícios e servem apenas como exemplo.
      </p>
      <h2>Responsabilidades</h2>
      <p>Garantias, reembolsos e suporte são de responsabilidade do produtor e da plataforma de venda.</p>
      <h2>Comissões</h2>
      <p>Podemos receber comissão por vendas realizadas através de nossos links de afiliado.</p>
    </LegalPage>
  ),
});
