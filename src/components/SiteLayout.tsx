import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { Search, Menu, X, BookOpen } from "lucide-react";

const nav = [
  { to: "/", label: "Início" },
  { to: "/cursos", label: "Cursos" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/cursos", search: { q: q || undefined, categoria: undefined } });
  };
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2" aria-label="AprendaMais, página inicial">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-brand-foreground">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-xl font-semibold text-brand">
            Aprenda<span className="text-primary">Mais</span>
          </span>
        </Link>
        <nav className="ml-6 hidden gap-6 md:flex" aria-label="Principal">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <form onSubmit={submit} className="ml-auto hidden md:block" role="search">
          <label className="relative block">
            <span className="sr-only">Pesquisar cursos</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar cursos" className="h-10 w-64 rounded-full border bg-card pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </label>
        </form>
        <button className="ml-auto rounded-md p-2 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t px-4 pb-4 md:hidden">
          <form onSubmit={submit} role="search" className="mt-3">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar cursos" aria-label="Pesquisar cursos" className="h-11 w-full rounded-full border bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </form>
          <nav className="mt-3 flex flex-col" aria-label="Principal móvel">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 font-medium">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-semibold">AprendaMais</p>
          <p className="mt-2 text-sm opacity-80">Conhecimento que abre caminhos.</p>
        </div>
        <nav className="flex flex-col gap-2 text-sm" aria-label="Rodapé">
          <Link to="/cursos" className="opacity-80 hover:opacity-100">Cursos</Link>
          <Link to="/contato" className="opacity-80 hover:opacity-100">Contato</Link>
          <Link to="/privacidade" className="opacity-80 hover:opacity-100">Política de privacidade</Link>
          <Link to="/termos" className="opacity-80 hover:opacity-100">Termos de uso</Link>
        </nav>
        <p className="text-xs leading-relaxed opacity-70">
          Somos afiliados. As compras, pagamentos e a entrega dos cursos acontecem na Hotmart ou na
          plataforma oficial do produtor. Podemos receber comissão pelas vendas realizadas por nossos links.
        </p>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
