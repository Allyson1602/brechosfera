import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";
import { ShieldCheck } from "lucide-react";

const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  BAZAAR_OWNER: "Gestor",
  CUSTOMER: "Cliente",
};

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const userRoleLabel = user?.role ? USER_ROLE_LABELS[user.role] : null;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <CardTitle className="text-2xl">Área do usuário</CardTitle>
            </div>

            {userRoleLabel && (
              <Badge variant="secondary">{userRoleLabel}</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="rounded-lg border bg-background p-4">
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          <Button variant="outline" onClick={logout} disabled={isLoading}>
            {isLoading ? "Saindo..." : "Sair"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

