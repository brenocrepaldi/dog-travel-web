"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Loader2,
  Plus,
  Trash2,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { managedPaymentMethods, type ManagedPaymentMethod } from "@/lib/mock-data";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { FlowActions } from "@/components/common/flow-actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type LoadState = "loading" | "ready" | "error";

interface MethodFormState {
  type: "credit_card" | "debit_card" | "pix";
  brand: string;
  holderName: string;
  expiresAt: string;
  value: string;
}

const INITIAL_FORM: MethodFormState = {
  type: "credit_card",
  brand: "Visa",
  holderName: "",
  expiresAt: "",
  value: "",
};

export default function PaymentMethodsPage() {
  const searchParams = useSearchParams();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [methods, setMethods] = useState<ManagedPaymentMethod[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [form, setForm] = useState<MethodFormState>(INITIAL_FORM);

  useEffect(() => {
    const shouldOpenAdd = searchParams.get("action") === "add";
    if (shouldOpenAdd) {
      setShowAddForm(true);
    }
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;

    const timer = setTimeout(() => {
      if (!mounted) return;

      if (searchParams.get("state") === "error") {
        setLoadState("error");
        return;
      }

      setMethods(structuredClone(managedPaymentMethods));
      setLoadState("ready");
    }, 650);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [searchParams]);

  const defaultMethod = useMemo(
    () => methods.find((method) => method.isDefault) ?? null,
    [methods]
  );

  function retryLoad() {
    setLoadState("loading");
    setFeedback(null);
    setTimeout(() => {
      setMethods(structuredClone(managedPaymentMethods));
      setLoadState("ready");
    }, 450);
  }

  function handleSetDefault(methodId: string) {
    setMethods((current) =>
      current.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );

    setFeedback("Metodo padrao atualizado com sucesso.");
    toast.success("Metodo definido como padrao.");
  }

  function handleRemove(methodId: string) {
    setMethods((current) => {
      const target = current.find((method) => method.id === methodId);
      const filtered = current.filter((method) => method.id !== methodId);

      if (!target) return current;
      if (target.isDefault && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }

      return filtered;
    });

    setFeedback("Metodo removido com sucesso.");
    toast.success("Metodo removido.");
  }

  async function handleAddMethod() {
    if (!form.holderName.trim()) {
      toast.error("Informe o nome do titular.");
      return;
    }

    if (!form.value.trim()) {
      toast.error(form.type === "pix" ? "Informe a chave PIX." : "Informe os ultimos 4 digitos.");
      return;
    }

    if (form.type !== "pix" && !/^\d{4}$/.test(form.value.trim())) {
      toast.error("Digite exatamente 4 digitos para o cartao.");
      return;
    }

    setSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const label = form.type === "pix" ? form.value.trim() : `**** ${form.value.trim()}`;

      const nextMethod: ManagedPaymentMethod = {
        id: `pm_${Date.now()}`,
        type: form.type,
        brand: form.brand,
        label,
        holderName: form.holderName.trim(),
        expiresAt: form.type === "pix" ? "--" : form.expiresAt || "12/29",
        isDefault: methods.length === 0,
        status: "active",
      };

      setMethods((current) => [...current, nextMethod]);
      setForm(INITIAL_FORM);
      setShowAddForm(false);
      setFeedback("Metodo adicionado com sucesso.");
      toast.success("Novo metodo cadastrado.");
    } finally {
      setSaving(false);
    }
  }

  function renderBody() {
    if (loadState === "loading") {
      return (
        <Card>
          <CardContent className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Carregando metodos de pagamento...
          </CardContent>
        </Card>
      );
    }

    if (loadState === "error") {
      return (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <p className="max-w-md text-sm text-muted-foreground">
              Nao foi possivel carregar seus metodos de pagamento agora.
            </p>
            <Button onClick={retryLoad}>Tentar novamente</Button>
          </CardContent>
        </Card>
      );
    }

    if (methods.length === 0) {
      return (
        <EmptyState
          icon={WalletCards}
          title="Nenhum metodo cadastrado"
          description="Adicione um cartao ou chave PIX para concluir seus pagamentos com rapidez."
          actionLabel="Adicionar metodo"
          actionHref="/payments/methods?action=add"
        />
      );
    }

    return (
      <div className="space-y-3">
        {methods.map((method) => (
          <Card key={method.id}>
            <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">
                    {method.brand} {method.label}
                  </p>
                  {method.isDefault && <Badge variant="success">Padrao</Badge>}
                  {method.status === "expired" && <Badge variant="warning">Expirado</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  Titular: {method.holderName} · Expira em {method.expiresAt}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!method.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    Definir padrao
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleRemove(method.id)}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Remover
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title="Metodos de pagamento"
        description="Adicione, remova e escolha o metodo padrao para cobrancas dos passeios."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/payments"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Voltar para pagamentos
            </Link>
            <Button onClick={() => setShowAddForm((current) => !current)}>
              <Plus className="mr-1.5 h-4 w-4" />
              {showAddForm ? "Fechar cadastro" : "Adicionar metodo"}
            </Button>
          </div>
        }
      />

      {feedback && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex items-center gap-2 py-3 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            {feedback}
          </CardContent>
        </Card>
      )}

      {defaultMethod && loadState === "ready" && (
        <Card>
          <CardHeader>
            <CardDescription>Metodo padrao atual</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              {defaultMethod.brand} {defaultMethod.label}
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {showAddForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Adicionar novo metodo</CardTitle>
            <CardDescription>
              Informe os dados do metodo para concluir o cadastro.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="method-type">Tipo</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      type: value as MethodFormState["type"],
                      brand: value === "pix" ? "PIX" : current.brand,
                    }))
                  }
                >
                  <SelectTrigger id="method-type">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Cartao de credito</SelectItem>
                    <SelectItem value="debit_card">Cartao de debito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="method-brand">Bandeira</Label>
                <Input
                  id="method-brand"
                  value={form.brand}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, brand: event.target.value }))
                  }
                  disabled={form.type === "pix"}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="holder-name">Titular</Label>
                <Input
                  id="holder-name"
                  value={form.holderName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, holderName: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="method-value">
                  {form.type === "pix" ? "Chave PIX" : "Ultimos 4 digitos"}
                </Label>
                <Input
                  id="method-value"
                  value={form.value}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, value: event.target.value }))
                  }
                  placeholder={form.type === "pix" ? "email@exemplo.com" : "4242"}
                />
              </div>
            </div>

            {form.type !== "pix" && (
              <div className="max-w-xs space-y-1.5">
                <Label htmlFor="expires-at">Validade</Label>
                <Input
                  id="expires-at"
                  value={form.expiresAt}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, expiresAt: event.target.value }))
                  }
                  placeholder="12/29"
                />
              </div>
            )}

            <FlowActions
              showBack
              backHref="/payments"
              cancelLabel="Cancelar cadastro"
              onCancel={() => {
                setForm(INITIAL_FORM);
                setShowAddForm(false);
              }}
              primaryLabel="Concluir cadastro"
              onPrimary={handleAddMethod}
              primaryDisabled={saving}
              primaryLoading={saving}
              primaryVariant="success"
            />
          </CardContent>
        </Card>
      )}

      {renderBody()}
    </div>
  );
}
