import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PropsWithChildren } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  ME_QUERY,
  REQUEST_EMAIL_VERIFICATION_CODE_MUTATION,
  REFRESH_SESSION_MUTATION,
  REGISTER_MUTATION,
} from "@/lib/graphql/queries/auth";
import type { AuthUser, LoginInput, RegisterInput } from "@/types/auth";
import { AuthContext, type AuthContextValue } from "./auth-context";

type AuthPayload = {
  success: boolean;
  message?: string | null;
  user?: AuthUser | null;
};

type MeQueryResult = {
  me: AuthUser | null;
};

type LoginMutationResult = {
  login: AuthPayload;
};

type RegisterMutationResult = {
  register: AuthPayload;
};

type RequestEmailVerificationCodeMutationResult = {
  requestEmailVerificationCode: Pick<AuthPayload, "success" | "message">;
};

type RefreshSessionMutationResult = {
  refreshSession: AuthPayload;
};

type LogoutMutationResult = {
  logout: Pick<AuthPayload, "success" | "message">;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasUnauthenticatedCode(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  const extensions = value.extensions;
  const code = isRecord(extensions) ? extensions.code : value.code;

  return code === "UNAUTHENTICATED";
}

function isUnauthenticatedError(error: unknown): boolean {
  if (hasUnauthenticatedCode(error)) {
    return true;
  }

  if (!isRecord(error)) {
    return false;
  }

  const graphQLErrors = error.graphQLErrors;
  if (Array.isArray(graphQLErrors)) {
    return graphQLErrors.some(hasUnauthenticatedCode);
  }

  const errors = error.errors;
  if (Array.isArray(errors)) {
    return errors.some(hasUnauthenticatedCode);
  }

  return false;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const refreshPromiseRef = useRef<Promise<AuthUser | null> | null>(null);

  const [loginMutation, { loading: isLoggingIn }] = useMutation<
    LoginMutationResult,
    { loginInput: LoginInput }
  >(LOGIN_MUTATION);
  const [registerMutation, { loading: isRegistering }] = useMutation<
    RegisterMutationResult,
    { registerInput: RegisterInput }
  >(REGISTER_MUTATION);
  const [requestEmailVerificationCodeMutation, { loading: isRequestingCode }] =
    useMutation<
      RequestEmailVerificationCodeMutationResult,
      { email: string }
    >(REQUEST_EMAIL_VERIFICATION_CODE_MUTATION);
  const [logoutMutation, { loading: isLoggingOut }] =
    useMutation<LogoutMutationResult>(LOGOUT_MUTATION);
  const [refreshSessionMutation, { loading: isRefreshing }] =
    useMutation<RefreshSessionMutationResult>(REFRESH_SESSION_MUTATION);

  const refreshSession = useCallback(async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshPromise = (async () => {
      try {
        const { data } = await refreshSessionMutation();
        const nextUser = data?.refreshSession?.user ?? null;
        setUser(nextUser);
        return nextUser;
      } catch {
        setUser(null);
        return null;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  }, [refreshSessionMutation]);

  const loadMe = useCallback(
    async (options?: { shouldRefresh?: boolean }) => {
      const shouldRefresh = options?.shouldRefresh ?? true;
      setIsCheckingSession(true);

      try {
        const { data } = await client.query<MeQueryResult>({
          query: ME_QUERY,
          fetchPolicy: "network-only",
        });
        const nextUser = data.me ?? null;
        setUser(nextUser);
        return nextUser;
      } catch (error) {
        if (shouldRefresh && isUnauthenticatedError(error)) {
          return refreshSession();
        }

        setUser(null);
        return null;
      } finally {
        setIsCheckingSession(false);
      }
    },
    [client, refreshSession],
  );

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  const login = useCallback(
    async (input: LoginInput) => {
      const { data } = await loginMutation({ variables: { loginInput: input } });
      const nextUser = data?.login?.user;

      if (!nextUser) {
        throw new Error("Não foi possível iniciar a sessão.");
      }

      setUser(nextUser);
      return nextUser;
    },
    [loginMutation],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const { data } = await registerMutation({
        variables: { registerInput: input },
      });
      const nextUser = data?.register?.user;

      if (!nextUser) {
        throw new Error("Não foi possível concluir o cadastro.");
      }

      setUser(nextUser);
      return nextUser;
    },
    [registerMutation],
  );

  const requestEmailVerificationCode = useCallback(
    async (email: string) => {
      await requestEmailVerificationCodeMutation({
        variables: { email: email.trim() },
      });
    },
    [requestEmailVerificationCodeMutation],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } finally {
      setUser(null);
      await client.clearStore();
      navigate("/login", { replace: true });
    }
  }, [client, logoutMutation, navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading:
        isCheckingSession ||
        isLoggingIn ||
        isRegistering ||
        isRequestingCode ||
        isLoggingOut ||
        isRefreshing,
      login,
      register,
      requestEmailVerificationCode,
      logout,
      refreshSession,
      loadMe,
      refetchMe: () => loadMe({ shouldRefresh: false }),
    }),
    [
      user,
      isCheckingSession,
      isLoggingIn,
      isRegistering,
      isRequestingCode,
      isLoggingOut,
      isRefreshing,
      login,
      register,
      requestEmailVerificationCode,
      logout,
      refreshSession,
      loadMe,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
