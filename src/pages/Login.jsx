import { useState } from "react";
import { Calculator, LoaderCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center pb-2 text-center">
          <span className="mb-3 flex size-11 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Calculator className="size-5" aria-hidden="true" />
          </span>
          <CardTitle className="text-xl">Compta MVP</CardTitle>
          <CardDescription className="text-sm">Connectez-vous à votre espace comptable</CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="vous@cabinet.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(error)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "login-error" : undefined}
                required
              />
            </div>

            {error && (
              <p id="login-error" role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={submitting || !email || !password}>
              {submitting && <LoaderCircle className="animate-spin" aria-hidden="true" />}
              Se connecter
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Démo : n'importe quelle adresse e-mail + mot de passe de 4 caractères minimum.
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
