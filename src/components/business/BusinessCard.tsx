import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { calculateRating } from "@/helpers/calculateRating";
import { parseAddress } from "@/helpers/parseAddress";
import { getItemTypeLabel } from "@/lib/business/itemTypeLabels";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import { Baazar } from "@/lib/graphql/generated";
import { Globe, MapPin, Star } from "lucide-react";

interface BusinessCardProps {
  business: Baazar;
  onClick?: () => void;
  variant?: "default" | "compact";
}

export function BusinessCard({
  business,
  onClick,
  variant = "default",
}: BusinessCardProps) {
  const logoSrc = resolveImageSrc(business.logoImage);

  if (variant === "compact") {
    return (
      <Card
        className="cursor-pointer overflow-hidden border-border/50 transition-all hover:-translate-y-1 hover:shadow-lg"
        onClick={onClick}
      >
        <div className="flex gap-3 p-3">
          <img
            src={logoSrc}
            alt={business.name}
            className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1 gap-1">
            <h3 className="truncate text-sm font-semibold">{business.name}</h3>

            {business.isOnline ? (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="h-3 w-3" />
                <span>Online</span>
              </div>
            ) : (
              business.address && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">
                    {parseAddress(business.address).neighborhood},{" "}
                    {parseAddress(business.address).city}
                  </span>
                </div>
              )
            )}

            {calculateRating(business.evaluations).count > 0 ? (
              <div className="mt-1 flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">
                  {calculateRating(business.evaluations).rating}
                </span>
                <span className="text-xs text-muted-foreground">
                  {calculateRating(business.evaluations).count}
                </span>
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                <Star className="h-3 w-3" />
                <p className="text-xs">Não avaliado</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/50 transition-all hover:-translate-y-1 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={logoSrc}
          alt={business.name}
          className="h-48 w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant="secondary" className="bg-slate-500 backdrop-blur-sm">
            Loja
          </Badge>

          {business.isOnline && (
            <Badge className="bg-primary/90 backdrop-blur-sm">
              <Globe className="mr-1 h-3 w-3" />
              Online
            </Badge>
          )}
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 backdrop-blur-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">
            {calculateRating(business.evaluations).rating}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-1 line-clamp-1 text-lg font-semibold">
          {business.name}
        </h3>
        {!business.isOnline && business.address ? (
          <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {parseAddress(business.address).neighborhood},{" "}
              {parseAddress(business.address).city}
            </span>
          </div>
        ) : (
          <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>Vendas online</span>
          </div>
        )}
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {business.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {business.itemsType.slice(0, 3).map((item) => (
            <Badge
              key={getItemTypeLabel(item)}
              variant="outline"
              className="text-xs"
            >
              {getItemTypeLabel(item)}
            </Badge>
          ))}
          {business.itemsType.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{business.itemsType.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
