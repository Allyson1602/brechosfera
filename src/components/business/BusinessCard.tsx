import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { calculateRating } from "@/helpers/calculateRating";
import { parseAddress } from "@/helpers/parseAddress";
import { getItemTypeLabel } from "@/lib/business/itemTypeLabels";
import {
  Baazar,
  BaazarItemRenewalType,
  BaazarStoreSizeType,
} from "@/lib/graphql/generated";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import {
  ArrowRight,
  Clock,
  Globe,
  HandHeart,
  MapPin,
  MessageCircle,
  RefreshCcw,
  Shirt,
  Star,
  Store,
  Wallet,
} from "lucide-react";

interface BusinessCardProps {
  business: Baazar;
  onClick?: () => void;
  variant?: "default" | "compact";
}

const STORE_SIZE_LABELS: Record<BaazarStoreSizeType, string> = {
  [BaazarStoreSizeType.Small]: "loja pequena",
  [BaazarStoreSizeType.Medium]: "loja média",
  [BaazarStoreSizeType.Large]: "loja grande",
};

const RENEWAL_LABELS: Record<BaazarItemRenewalType, string> = {
  [BaazarItemRenewalType.Daily]: "novidades diárias",
  [BaazarItemRenewalType.Weekly]: "novidades semanais",
  [BaazarItemRenewalType.Monthly]: "novidades mensais",
  [BaazarItemRenewalType.Quarterly]: "renovação trimestral",
  [BaazarItemRenewalType.SemiAnnually]: "renovação semestral",
  [BaazarItemRenewalType.Annually]: "renovação anual",
};

function formatCurrency(value?: number | null) {
  if (!value || value <= 0) return "Preço a combinar";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function getAddressLabel(address?: string | null) {
  if (!address) return "Endereço não informado";

  const parsedAddress = parseAddress(address);
  const shortAddress = [parsedAddress.neighborhood, parsedAddress.city]
    .filter(Boolean)
    .join(", ");

  return shortAddress || address;
}

function getFirstOpeningHour(openingHours?: string[]) {
  return openingHours?.find((hour) => hour.trim().length > 0);
}

function hasWhatsapp(value: unknown) {
  if (Array.isArray(value)) {
    return value.some((item) => String(item).trim().length > 0);
  }

  return typeof value === "string" && value.trim().length > 0;
}

function getBusinessInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function BusinessCard({
  business,
  onClick,
  variant = "default",
}: BusinessCardProps) {
  const logoSrc = resolveImageSrc(business.logoImage);
  const rating = calculateRating(business.evaluations);
  const addressLabel = business.isOnline
    ? "Atendimento online"
    : getAddressLabel(business.address);
  const firstOpeningHour = getFirstOpeningHour(business.openingHours);
  const itemTypes = business.itemsType ?? [];
  const visibleItemTypes = itemTypes.slice(0, variant === "compact" ? 2 : 4);
  const priceLabel = formatCurrency(business.averagePrice);
  const whatsappAvailable = hasWhatsapp(business.linkWhatsapp);

  if (variant === "compact") {
    return (
      <Card
        className="cursor-pointer overflow-hidden rounded-2xl border-border/50 transition-all hover:-translate-y-1 hover:shadow-lg"
        onClick={onClick}
      >
        <div className="flex gap-3 p-3.5">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card p-2 shadow-sm">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={business.name}
                className="h-full w-full rounded-xl object-contain"
              />
            ) : (
              <Store className="h-6 w-6 text-primary" aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-sm font-semibold">
                {business.name}
              </h3>
              {rating.count > 0 && (
                <span className="flex items-center gap-1 text-xs font-medium">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {rating.rating}
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              {business.isOnline ? (
                <Globe className="h-3 w-3" />
              ) : (
                <MapPin className="h-3 w-3" />
              )}
              <span className="truncate">{addressLabel}</span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              <Badge className="bg-primary/10 text-[11px] text-primary hover:bg-primary/15">
                {priceLabel}
              </Badge>
              {visibleItemTypes.map((item) => (
                <Badge
                  key={getItemTypeLabel(item)}
                  variant="outline"
                  className="text-[11px]"
                >
                  {getItemTypeLabel(item)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-accent via-card to-muted/40 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge className="mb-3 rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur hover:bg-card">
              {business.isOnline ? (
                <Globe className="mr-1 h-3 w-3 text-primary" />
              ) : (
                <MapPin className="mr-1 h-3 w-3 text-primary" />
              )}
              {business.isOnline ? "Loja online" : "Loja local"}
            </Badge>
            <h3 className="line-clamp-2 text-xl font-extrabold leading-tight">
              {business.name}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              {business.isOnline ? (
                <Globe className="h-4 w-4 flex-shrink-0 text-primary" />
              ) : (
                <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
              )}
              <span className="truncate">{addressLabel}</span>
            </p>
          </div>

          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card p-2.5 shadow-md transition-transform duration-300 group-hover:scale-[1.03]">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={business.name}
                className="h-full w-full rounded-xl object-contain"
              />
            ) : (
              <span className="text-lg font-extrabold text-primary">
                {getBusinessInitials(business.name)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="rounded-full bg-primary text-primary-foreground shadow-sm">
            <Wallet className="mr-1 h-3 w-3" />
            {priceLabel}
          </Badge>

          <Badge className="rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur hover:bg-card">
            <Star
              className={
                rating.count > 0
                  ? "mr-1 h-3 w-3 fill-yellow-400 text-yellow-400"
                  : "mr-1 h-3 w-3 text-primary"
              }
            />
            {rating.count > 0
              ? `${rating.rating} (${rating.count})`
              : "Loja nova"}
          </Badge>

          {business.isAcceptExchange && (
            <Badge className="rounded-full bg-secondary text-secondary-foreground shadow-sm">
              <RefreshCcw className="mr-1 h-3 w-3" />
              Aceita troca
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-5">
        <div className="space-y-2">
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {business.description ||
              "Loja cadastrada na Brechosfera com peças para garimpar sem pressa."}
          </p>
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex items-center gap-2 rounded-2xl bg-muted/50 px-3 py-2">
            <Shirt className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="truncate">
              {visibleItemTypes.length > 0
                ? visibleItemTypes.map((item) => getItemTypeLabel(item)).join(", ")
                : "Variedade de peças"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-muted/50 px-3 py-2">
            <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="truncate">
              {firstOpeningHour || "Horário sob consulta"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-muted/50 px-3 py-2">
            <HandHeart className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="truncate">
              {RENEWAL_LABELS[business.itemRenewal] ||
                STORE_SIZE_LABELS[business.storeSize] ||
                "Garimpos selecionados"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {visibleItemTypes.map((item) => (
            <Badge key={getItemTypeLabel(item)} variant="outline">
              {getItemTypeLabel(item)}
            </Badge>
          ))}
          {itemTypes.length > visibleItemTypes.length && (
            <Badge variant="outline">
              +{itemTypes.length - visibleItemTypes.length} categorias
            </Badge>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="text-xs text-muted-foreground">
            {rating.count > 0
              ? `${rating.count} avaliação${rating.count !== 1 ? "ões" : ""}`
              : "Seja a primeira pessoa a avaliar"}
          </div>

          <Button size="sm" className="gap-2 rounded-full">
            {whatsappAvailable ? (
              <>
                <MessageCircle className="h-4 w-4" />
                Chamar
              </>
            ) : (
              <>
                Ver loja
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
