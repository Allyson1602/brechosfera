import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, UserPlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  emailVerificationCode: z
    .string()
    .regex(/^\d{6}$/, "Informe o código de 6 dígitos."),
  acceptedTerms: z.boolean().refine(Boolean, {
    message: "Aceite os termos de uso para criar sua conta.",
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const DEFAULT_EMAIL_CODE_COOLDOWN_SECONDS = 60;

export default function AuthRegisterPage() {
  const {
    register: registerUser,
    requestEmailVerificationCode,
    isAuthenticated,
    isLoading,
  } = useAuth();
  const navigate = useNavigate();
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [hasRequestedCode, setHasRequestedCode] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      emailVerificationCode: "",
      acceptedTerms: false,
    },
  });

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
    if (!isEmailValid) {
      return;
    }

    setIsSendingCode(true);
    try {
      await requestEmailVerificationCode(getValues("email"));
      setHasRequestedCode(true);
      setResendSeconds(DEFAULT_EMAIL_CODE_COOLDOWN_SECONDS);
      toast.success("Código de verificação enviado.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível enviar o código agora."));
    } finally {
      setIsSendingCode(false);
    }
  };

  const isCodeRequestDisabled = isSendingCode || isLoading || resendSeconds > 0;
  const codeRequestLabel =
    resendSeconds > 0
      ? `Reenviar em ${resendSeconds}s`
      : isSendingCode
        ? "Enviando..."
        : "Enviar código";

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        emailVerificationCode: data.emailVerificationCode,
        acceptedTerms: data.acceptedTerms,
      });
      toast.success("Cadastro criado.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível criar o cadastro agora."));
    }
  };

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-10">
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
            <UserPlus className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl">Criar conta</CardTitle>
          <CardDescription>
            Faça parte da Brechosfera. <br /> Salve favoritos, acompanhe lojas
            ou cadastre a sua.
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
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
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
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleRequestCode}
                  disabled={isCodeRequestDisabled}
                  className="text-white"
                >
                  {codeRequestLabel}
                </Button>
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailVerificationCode">Código do e-mail</Label>
              <Input
                id="emailVerificationCode"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                {...register("emailVerificationCode")}
              />
              {errors.emailVerificationCode && (
                <p className="text-sm text-destructive">
                  {errors.emailVerificationCode.message}
                </p>
              )}
              {hasRequestedCode && (
                <p className="text-sm text-muted-foreground">
                  Confira a caixa de entrada e o spam.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo de 8 caracteres"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Controller
              name="acceptedTerms"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="acceptedTerms"
                    className="flex items-start gap-3 rounded-lg border bg-background/70 p-3 text-sm"
                  >
                    <Checkbox
                      id="acceptedTerms"
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value === true)}
                    />
                    <span className="text-muted-foreground">
                      Li e aceito os{" "}
                      <Link
                        to="/termos-de-uso"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                      >
                        termos de uso
                      </Link>{" "}
                      da Brechosfera.
                    </span>
                  </label>
                  {errors.acceptedTerms && (
                    <p className="text-sm text-destructive">
                      {errors.acceptedTerms.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Criando..." : "Criar conta"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="font-medium text-primary">
              Entrar
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Quer cadastrar uma loja?{" "}
            <Link to="/cadastrar" className="font-medium text-primary">
              Cadastrar loja
            </Link>
          </p>
        </CardContent>
      </Card>
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
