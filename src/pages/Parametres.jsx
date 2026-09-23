import { useState } from "react";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DateInput } from "@/components/ui/date-input";
import { Input, inputClassName } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { TVA_RATES } from "@/data/planComptable";

const INITIAL_SETTINGS = {
  companyName: "Atlas Conseil SARL",
  ice: "001234567000089",
  fiscalId: "40123456",
  fiscalStart: "2026-01-01",
  fiscalEnd: "2026-12-31",
  defaultTva: "20",
  currency: "MAD",
};

function Field({ id, label, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export default function Parametres() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [saved, setSaved] = useState(false);

  const updateDate = (field) => (value) => {
    setSaved(false);
    setSettings((current) => ({ ...current, [field]: value }));
  };
  const update = (field) => (event) => updateDate(field)(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <>
      <PageHeader description="Informations du dossier et préférences de saisie." />

      <form onSubmit={handleSubmit} className="grid max-w-4xl gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Société</CardTitle>
            <CardDescription>Identifiants légaux utilisés sur les états et déclarations.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field id="companyName" label="Raison sociale">
              <Input id="companyName" value={settings.companyName} onChange={update("companyName")} required />
            </Field>
            <Field id="ice" label="ICE">
              <Input id="ice" inputMode="numeric" value={settings.ice} onChange={update("ice")} />
            </Field>
            <Field id="fiscalId" label="Identifiant fiscal (IF)">
              <Input id="fiscalId" inputMode="numeric" value={settings.fiscalId} onChange={update("fiscalId")} />
            </Field>
            <Field id="currency" label="Devise">
              <Select id="currency" value={settings.currency} onChange={update("currency")}>
                <option value="MAD">MAD — Dirham marocain</option>
                <option value="EUR">EUR — Euro</option>
              </Select>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exercice & saisie</CardTitle>
            <CardDescription>Période comptable et valeurs par défaut du formulaire de saisie.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Field id="fiscalStart" label="Début d'exercice">
              <DateInput
                id="fiscalStart"
                inputClassName={inputClassName}
                value={settings.fiscalStart}
                onChange={updateDate("fiscalStart")}
              />
            </Field>
            <Field id="fiscalEnd" label="Fin d'exercice">
              <DateInput
                id="fiscalEnd"
                inputClassName={inputClassName}
                value={settings.fiscalEnd}
                onChange={updateDate("fiscalEnd")}
              />
            </Field>
            <Field id="defaultTva" label="Taux de TVA par défaut">
              <Select id="defaultTva" value={settings.defaultTva} onChange={update("defaultTva")}>
                {TVA_RATES.map((rate) => (
                  <option key={rate.value} value={rate.value}>
                    {rate.label}
                  </option>
                ))}
              </Select>
            </Field>
          </CardContent>
          <CardFooter className="justify-end gap-3 border-t pt-4">
            <p role="status" aria-live="polite" className="mr-auto text-sm text-success">
              {saved && "Paramètres enregistrés."}
            </p>
            <Button type="submit">
              <Save aria-hidden="true" /> Enregistrer
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
