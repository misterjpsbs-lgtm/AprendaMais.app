import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso administrativo — AprendaMais" },
      { name: "description", content: "Entrada do painel administrativo." },
      { property: "og:title", content: "Acesso administrativo — AprendaMais" },
      { property: "og:description", content: "Entrada do painel administrativo." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error("E-mail ou senha inválidos.");
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Conta criada. Confirme pelo link enviado ao seu e-mail e depois entre.");
      setMode("in");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-secondary px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">{mode === "in" ? "Entrar no painel" : "Criar conta de administrador"}</h1>
        <label className="mt-6 block text-sm font-medium">E-mail
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-11 w-full rounded-lg border px-3" autoComplete="email" />
        </label>
        <label className="mt-4 block text-sm font-medium">Senha
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 h-11 w-full rounded-lg border px-3" autoComplete={mode === "in" ? "current-password" : "new-password"} />
        </label>
        <button disabled={busy} className="mt-6 h-11 w-full rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-60">
          {busy ? "Aguarde…" : mode === "in" ? "Entrar" : "Criar conta"}
        </button>
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 w-full text-sm text-muted-foreground">
          {mode === "in" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
        </button>
        <p className="mt-4 text-xs text-muted-foreground">Somente a primeira conta criada recebe acesso de administrador.</p>
      </form>
    </div>
  );
}
