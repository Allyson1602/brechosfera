import { createContext } from "react";
import type { AuthUser, LoginInput, RegisterInput } from "@/types/auth";

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  requestEmailVerificationCode: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthUser | null>;
  loadMe: (options?: { shouldRefresh?: boolean }) => Promise<AuthUser | null>;
  refetchMe: () => Promise<AuthUser | null>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
