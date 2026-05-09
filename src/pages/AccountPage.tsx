import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Mail, Save, Trash2, UserCog } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";

const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  BAZAAR_OWNER: "Gestor",
  CUSTOMER: "Cliente",
};

const accountSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().optional(),
  accountVerificationCode: z.string().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

const DEFAULT_ACCOUNT_CODE_COOLDOWN_SECONDS = 60;

export default function AccountPage() {
  const {
    user,
    isLoading,
    requestAccountUpdateVerificationCode,
    updateAccount,
    deleteAccount,
  } = useAuth();
  const navigate = useNavigate();
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      accountVerificationCode: "",
    },
  });

  const watchedEmail = watch("email");
  const watchedPassword = watch("password");
  const normalizedCurrentEmail = user?.email.trim().toLowerCase() ?? "";
  const normalizedNextEmail = watchedEmail.trim().toLowerCase();
  const isChangingEmail =
    !!normalizedNextEmail && normalizedNextEmail !== normalizedCurrentEmail;
  const isChangingPassword = !!watchedPassword?.trim();
  const needsCode = isChangingEmail || isChangingPassword;

  const codeHint = useMemo(() => {
    if (isChangingEmail) {
      return "O código será enviado para o novo e-mail.";
    }

    if (isChangingPassword) {
      return "O código será enviado para seu e-mail atual.";
    }

    return "Código necessário apenas para alterar e-mail ou senha.";
  }, [isChangingEmail, isChangingPassword]);

  useEffect(() => {
    if (!user) {
      return;
    }

    reset({
      name: user.name,
      email: user.email,
      password: "",
      accountVerificationCode: "",
    });
  }, [reset, user]);

  useEffect(() => {
    if (resendSeconds <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setResendSeconds((currentValue) => Math.max(currentValue - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [resendSeconds]);

  const handleRequestCode = async () => {
    const isEmailValid = await trigger("email");

    if (!isEmailValid || !user) {
      return;
    }

    setIsSendingCode(true);
    try {
      await requestAccountUpdateVerificationCode(
        isChangingEmail ? { email: watchedEmail } : {},
      );
      setResendSeconds(DEFAULT_ACCOUNT_CODE_COOLDOWN_SECONDS);
      toast.success("Código de verificação enviado.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível enviar o código."));
    } finally {
      setIsSendingCode(false);
    }
  };

  const onSubmit = async (data: AccountFormData) => {
    if (!user) {
      return;
    }

    const nextName = data.name.trim();
    const nextEmail = data.email.trim();
    const password = data.password?.trim() ?? "";
    const isEmailChanged =
      nextEmail.toLowerCase() !== user.email.trim().toLowerCase();
    const isNameChanged = nextName !== user.name.trim();
    const isPasswordChanged = password.length > 0;

    if (isPasswordChanged && password.length < 8) {
      toast.error("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if ((isEmailChanged || isPasswordChanged) && !data.accountVerificationCode) {
      toast.error("Informe o código de verificação.");
      return;
    }

    if (!isNameChanged && !isEmailChanged && !isPasswordChanged) {
      toast.info("Nenhuma alteração para salvar.");
      return;
    }

    try {
      await updateAccount({
        ...(isNameChanged ? { name: nextName } : {}),
        ...(isEmailChanged ? { email: nextEmail } : {}),
        ...(isPasswordChanged ? { password } : {}),
        ...(isEmailChanged || isPasswordChanged
          ? { accountVerificationCode: data.accountVerificationCode?.trim() }
          : {}),
      });
      toast.success("Conta atualizada.");
      reset({
        name: nextName,
        email: nextEmail,
        password: "",
        accountVerificationCode: "",
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível atualizar a conta."));
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast.error("Informe sua senha atual para excluir a conta.");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount({ currentPassword: deletePassword });
      toast.success("Conta excluída.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível excluir a conta."));
    } finally {
      setIsDeleting(false);
    }
  };

  const codeRequestDisabled =
    isSendingCode || isLoading || resendSeconds > 0 || !needsCode;
  const codeRequestLabel =
    resendSeconds > 0
      ? `Reenviar em ${resendSeconds}s`
      : isSendingCode
        ? "Enviando..."
        : "Enviar código";
  const userRoleLabel = user?.role ? USER_ROLE_LABELS[user.role] : null;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
            <UserCog className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Minha conta</h1>
            <p className="text-sm text-muted-foreground">
              Atualize seus dados e preferências de acesso.
            </p>
          </div>
        </div>

        {userRoleLabel && (
          <Badge variant="secondary" className="w-fit">
            {userRoleLabel}
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do usuário</CardTitle>
            <CardDescription>
              Alterações de e-mail ou senha exigem confirmação por código.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="Seu nome"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="pl-9"
                    placeholder="voce@email.com"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className="pl-9"
                    placeholder="Deixe em branco para manter a senha atual"
                    {...register("password")}
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-background/70 p-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="Código de verificação"
                    disabled={!needsCode}
                    {...register("accountVerificationCode")}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleRequestCode}
                    disabled={codeRequestDisabled}
                    className="text-white"
                  >
                    {codeRequestLabel}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{codeHint}</p>
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting || isLoading}
              >
                <Save className="h-4 w-4" />
                {isSubmitting || isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle>Excluir conta</CardTitle>
            <CardDescription>
              Esta ação remove seu cadastro e encerra a sessão atual.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deletePassword">Senha atual</Label>
              <Input
                id="deletePassword"
                type="password"
                autoComplete="current-password"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                placeholder="Confirme sua senha"
              />
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isDeleting || isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir sua conta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Seus dados de acesso serão
                    removidos e você será desconectado.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDeleteAccount}
                  >
                    Confirmar exclusão
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = String((error as { message?: unknown }).message ?? "");

    if (message) {
      return message;
    }
  }

  return fallback;
}
