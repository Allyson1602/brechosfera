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
        className="cursor-pointer overflow-hidden border-border/50 transition-all hover:-translate-y-1 hover:shadow-lg"
        onClick={onClick}
      >
        <div className="flex gap-3 p-3">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-muted/40 p-2">
            <img
              src={logoSrc}
              alt={business.name}
              className="h-full w-full rounded-md object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-sm font-semibold">{business.name}</h3>
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
              <Badge variant="secondary" className="text-[11px]">
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
      <div className="relative overflow-hidden bg-muted/30">
        <img
          src={logoSrc}
          alt={business.name}
          className="h-52 w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge className="rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur">
            <Wallet className="mr-1 h-3 w-3 text-primary" />
            {priceLabel}
          </Badge>

          {business.isAcceptExchange && (
            <Badge className="rounded-full bg-primary/90 text-primary-foreground shadow-sm backdrop-blur">
              <RefreshCcw className="mr-1 h-3 w-3" />
              Aceita troca
            </Badge>
          )}
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-sm font-semibold shadow-sm backdrop-blur">
          <Star
            className={
              rating.count > 0
                ? "h-4 w-4 fill-yellow-400 text-yellow-400"
                : "h-4 w-4 text-muted-foreground"
            }
          />
          <span>{rating.count > 0 ? rating.rating : "Novo"}</span>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-5">
        <div className="space-y-2">
          <div>
            <h3 className="line-clamp-1 text-xl font-bold">{business.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              {business.isOnline ? (
                <Globe className="h-4 w-4 flex-shrink-0 text-primary" />
              ) : (
                <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
              )}
              <span className="truncate">{addressLabel}</span>
            </p>
          </div>

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
