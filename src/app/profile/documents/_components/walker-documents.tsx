"use client";

import { useId, useRef, useState } from "react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// ─── Types ─────────────────────────────────────────────────────────────────

type DocStatus = "idle" | "pending" | "verified";

interface CertEntry {
  id: string;
  title: string;
  fileName: string;
  status: DocStatus;
}

// ─── Mock initial certs ─────────────────────────────────────────────────────

const INITIAL_CERTS: CertEntry[] = [
  {
    id: "c1",
    title: "Adestramento Positivo",
    fileName: "cert_adestramento.pdf",
    status: "verified",
  },
  {
    id: "c2",
    title: "Primeiros Socorros com Pets",
    fileName: "primeiros_socorros_2024.jpg",
    status: "pending",
  },
];

// ─── Status config ──────────────────────────────────────────────────────────

const STATUS: Record<
  DocStatus,
  { label: string; icon: React.ElementType; cls: string }
> = {
  idle: {
    label: "Não enviado",
    icon: AlertCircle,
    cls: "bg-muted text-muted-foreground border-border/60",
  },
  pending: {
    label: "Em análise",
    icon: Clock,
    cls: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  },
  verified: {
    label: "Verificado",
    icon: CheckCircle2,
    cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  },
};

// ─── StatusBadge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DocStatus }) {
  const { label, cls, icon: Icon } = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        cls,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {label}
    </span>
  );
}

// ─── UploadZone ─────────────────────────────────────────────────────────────

function UploadZone({
  label,
  hint,
  file,
  onFile,
  disabled = false,
  accept = ".pdf,.jpg,.jpeg,.png",
}: {
  label: string;
  hint: string;
  file: File | null;
  onFile: (f: File | null) => void;
  disabled?: boolean;
  accept?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const inputId = useId();

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <input
        ref={ref}
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          onFile(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/[0.03] px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-[11px] text-muted-foreground">
              {file.size < 1024 * 1024
                ? `${(file.size / 1024).toFixed(0)} KB`
                : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
            </p>
          </div>
          {!disabled && (
            <button
              type="button"
              aria-label="Remover arquivo"
              onClick={() => onFile(null)}
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => ref.current?.click()}
          className={cn(
            "flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all",
            disabled
              ? "cursor-not-allowed border-border/30 opacity-50"
              : "cursor-pointer border-border/60 hover:border-primary/40 hover:bg-primary/[0.02]",
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <Upload className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Selecionar arquivo</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
          </div>
        </button>
      )}
    </div>
  );
}

// ─── DocCardHeader ──────────────────────────────────────────────────────────

function DocCardHeader({
  icon: Icon,
  iconBg,
  iconColor,
  barClass,
  title,
  description,
  status,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  barClass: string;
  title: string;
  description: string;
  status: DocStatus;
}) {
  return (
    <>
      <div className={cn("h-1 w-full bg-gradient-to-r", barClass)} />
      <CardHeader className="pb-4 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                iconBg,
              )}
            >
              <Icon className={cn("h-4 w-4", iconColor)} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              <CardDescription className="mt-0.5 text-xs">{description}</CardDescription>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
    </>
  );
}

// ─── Status info banners ────────────────────────────────────────────────────

function PendingBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3.5">
      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300">{message}</p>
    </div>
  );
}

function VerifiedBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3.5">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-300">{message}</p>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function WalkerDocuments() {
  // Identity
  const [identityDoc, setIdentityDoc] = useState<File | null>(null);
  const [identitySelfie, setIdentitySelfie] = useState<File | null>(null);
  const [identityStatus, setIdentityStatus] = useState<DocStatus>("idle");

  // Background check
  const [bgDoc, setBgDoc] = useState<File | null>(null);
  const [bgStatus, setBgStatus] = useState<DocStatus>("idle");

  // Certifications
  const [certs, setCerts] = useState<CertEntry[]>(INITIAL_CERTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [certTitle, setCertTitle] = useState("");
  const [certFile, setCertFile] = useState<File | null>(null);

  function submitIdentity() {
    setIdentityStatus("pending");
    setIdentityDoc(null);
    setIdentitySelfie(null);
    toast.success("Documentos enviados!", {
      description: "Verificação em até 3 dias úteis.",
    });
  }

  function submitBackground() {
    setBgStatus("pending");
    setBgDoc(null);
    toast.success("Certidão enviada!", {
      description: "Verificação em até 5 dias úteis.",
    });
  }

  function addCert() {
    if (!certTitle.trim() || !certFile) return;
    const entry: CertEntry = {
      id: crypto.randomUUID(),
      title: certTitle.trim(),
      fileName: certFile.name,
      status: "pending",
    };
    setCerts((prev) => [...prev, entry]);
    setCertTitle("");
    setCertFile(null);
    setDialogOpen(false);
    toast.success("Certificação adicionada!", {
      description: "Aguardando verificação da equipe DogTravel.",
    });
  }

  function closeCertDialog() {
    setDialogOpen(false);
    setCertTitle("");
    setCertFile(null);
  }

  function removeCert(id: string) {
    setCerts((prev) => prev.filter((c) => c.id !== id));
    toast("Certificação removida.");
  }

  return (
    <>
      <div className="space-y-6">

        {/* ── Verificação de identidade ──────────────────────────────────────── */}
        <Card className="overflow-hidden py-0 gap-0">
          <DocCardHeader
            icon={ShieldCheck}
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-600 dark:text-emerald-400"
            barClass="from-emerald-400/60 via-emerald-500 to-emerald-400/40"
            title="Verificação de Identidade"
            description="Envie um documento oficial e uma selfie segurando o documento"
            status={identityStatus}
          />
          <Separator />
          <CardContent className="space-y-5 py-5">
            {identityStatus === "idle" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <UploadZone
                    label="Documento oficial"
                    hint="RG, CNH ou passaporte · PDF ou imagem · máx. 5 MB"
                    file={identityDoc}
                    onFile={setIdentityDoc}
                  />
                  <UploadZone
                    label="Selfie com o documento"
                    hint="Foto segurando o documento aberto · JPG ou PNG · máx. 5 MB"
                    accept=".jpg,.jpeg,.png"
                    file={identitySelfie}
                    onFile={setIdentitySelfie}
                  />
                </div>
                <Button
                  size="sm"
                  className="rounded-lg gap-1.5 shadow-sm"
                  disabled={!identityDoc || !identitySelfie}
                  onClick={submitIdentity}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Enviar para análise
                </Button>
              </>
            )}
            {identityStatus === "pending" && (
              <PendingBanner message="Seus documentos foram recebidos e estão em análise. A verificação é realizada em até 3 dias úteis. Você será notificado por e-mail quando concluída." />
            )}
            {identityStatus === "verified" && (
              <VerifiedBanner message="Identidade verificada e aprovada pela DogTravel. Suas informações estão protegidas e a verificação é válida por 12 meses." />
            )}
          </CardContent>
        </Card>

        {/* ── Antecedentes criminais ─────────────────────────────────────────── */}
        <Card className="overflow-hidden py-0 gap-0">
          <DocCardHeader
            icon={FileCheck2}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-600 dark:text-blue-400"
            barClass="from-blue-400/60 via-blue-500 to-blue-400/40"
            title="Antecedentes Criminais"
            description="Certidão de antecedentes emitida nos últimos 90 dias"
            status={bgStatus}
          />
          <Separator />
          <CardContent className="space-y-5 py-5">
            <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/30 px-4 py-3.5">
              <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                <p>
                  A certidão de antecedentes criminais pode ser emitida gratuitamente
                  pelo portal do governo federal. O documento deve ter sido emitido nos
                  últimos 90 dias.
                </p>
                <a
                  href="https://www.gov.br/pt-br/servicos/emitir-certidao-de-antecedentes-criminais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  Emitir no portal gov.br
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            {bgStatus === "idle" && (
              <>
                <UploadZone
                  label="Certidão de antecedentes"
                  hint="PDF ou imagem · emitida nos últimos 90 dias · máx. 5 MB"
                  file={bgDoc}
                  onFile={setBgDoc}
                />
                <Button
                  size="sm"
                  className="rounded-lg gap-1.5 shadow-sm"
                  disabled={!bgDoc}
                  onClick={submitBackground}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Enviar para análise
                </Button>
              </>
            )}
            {bgStatus === "pending" && (
              <PendingBanner message="Certidão recebida e em análise pela equipe DogTravel. A verificação é realizada em até 5 dias úteis. Você será notificado por e-mail quando concluída." />
            )}
            {bgStatus === "verified" && (
              <VerifiedBanner message="Antecedentes criminais verificados e aprovados. A checagem é válida por 12 meses a partir da data de emissão do documento." />
            )}
          </CardContent>
        </Card>

        {/* ── Certificações e credenciais ────────────────────────────────────── */}
        <Card className="overflow-hidden py-0 gap-0">
          <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/40" />
          <CardHeader className="pb-4 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Certificações e Credenciais
                  </CardTitle>
                  <CardDescription className="mt-0.5 text-xs">
                    Cursos, formações e treinamentos profissionais
                  </CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg gap-1.5 shrink-0"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="py-5">
            {certs.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <Award className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Nenhuma certificação adicionada
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Adicione cursos e formações para fortalecer seu perfil profissional.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-1 rounded-lg gap-1.5"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar certificação
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {certs.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center gap-4 rounded-xl border border-border/60 bg-card px-4 py-3.5 transition-colors hover:bg-accent/20"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {cert.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                        <FileText className="h-3 w-3 shrink-0" />
                        {cert.fileName}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={cert.status} />
                      {cert.status !== "verified" && (
                        <button
                          type="button"
                          aria-label={`Remover ${cert.title}`}
                          onClick={() => removeCert(cert.id)}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Footer banner ──────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-5 py-4">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Seus documentos estão seguros
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Todos os documentos são armazenados com criptografia de ponta a ponta.
              As informações são utilizadas exclusivamente para verificação do perfil
              profissional e nunca são compartilhadas com terceiros.
            </p>
          </div>
        </div>

      </div>

      {/* ── Dialog: adicionar certificação ─────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-base">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                <Award className="h-4 w-4 text-primary" />
              </div>
              Adicionar certificação
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-1">
            <div className="space-y-2">
              <Label
                htmlFor="cert-title"
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Nome da certificação
              </Label>
              <Input
                id="cert-title"
                placeholder="Ex: Adestramento Positivo"
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                className="rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") addCert();
                }}
              />
            </div>

            <UploadZone
              label="Arquivo do certificado"
              hint="PDF ou imagem · máx. 5 MB"
              file={certFile}
              onFile={setCertFile}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg"
              onClick={closeCertDialog}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              className="rounded-lg gap-1.5 shadow-sm"
              disabled={!certTitle.trim() || !certFile}
              onClick={addCert}
            >
              <Plus className="h-3.5 w-3.5" />
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
