import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de privacidade — AprendaMais" },
      { name: "description", content: "Como a AprendaMais trata seus dados, em conformidade com a LGPD." },
      { property: "og:title", content: "Política de privacidade — AprendaMais" },
      { property: "og:description", content: "Como a AprendaMais trata seus dados." },
    ],
  }),
  component: () => (
    <LegalPage title="Política de privacidade">
      <p>Esta política explica como a AprendaMais trata informações, de acordo com a Lei Geral de Proteção de Dados (LGPD).</p>
      <h2>Dados coletados</h2>
      <p>
        Registramos apenas estatísticas anônimas: páginas visitadas e cliques nos botões de compra, com data e hora.
        Não usamos cookies de rastreamento, não armazenamos endereço IP e não coletamos nome, e-mail ou outros dados pessoais dos visitantes.
      </p>
      <h2>Links para terceiros</h2>
      <p>
        Ao clicar em “Comprar na Hotmart”, você é direcionado à Hotmart ou à plataforma do produtor, que possuem
        suas próprias políticas de privacidade. A compra e os dados de pagamento são tratados exclusivamente por elas.
      </p>
      <h2>Programa de afiliados</h2>
      <p>Somos afiliados e podemos receber comissão por compras feitas através dos nossos links, sem custo adicional para você.</p>
      <h2>Contato</h2>
      <p>Para dúvidas sobre esta política, utilize a página de contato.</p>
    </LegalPage>
  ),
});
