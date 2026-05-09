export const USER_ROLES = ["ADMIN", "BAZAAR_OWNER", "CUSTOMER"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  emailVerificationCode: string;
};
