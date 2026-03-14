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
        className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-border/50"
        onClick={onClick}
      >
        <div className="flex gap-3 p-3">
          <img
            src={logoSrc}
            alt={business.name}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0 gap-1">
            <h3 className="font-semibold text-sm truncate">{business.name}</h3>

            {business.isOnline ? (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="w-3 h-3" />
                <span>Online</span>
              </div>
            ) : (
              business.address && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">
                    {parseAddress(business.address).neighborhood},{" "}
                    {parseAddress(business.address).city}
                  </span>
                </div>
              )
            )}

            {calculateRating(business.evaluations).count > 0 ? (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">
                  {calculateRating(business.evaluations).rating}
                </span>
                <span className="text-xs text-muted-foreground">
                  {calculateRating(business.evaluations).count}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                <Star className="w-3 h-3" />
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
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-border/50 group"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={logoSrc}
          alt={business.name}
          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-slate-500 backdrop-blur-sm">
            Loja
          </Badge>

          {business.isOnline && (
            <Badge className="bg-primary/90 backdrop-blur-sm">
              <Globe className="w-3 h-3 mr-1" />
              Online
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">
            {calculateRating(business.evaluations).rating}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {business.name}
        </h3>
        {!business.isOnline && business.address ? (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {parseAddress(business.address).neighborhood},{" "}
              {parseAddress(business.address).city}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <Globe className="w-4 h-4" />
            <span>Vendas Online</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {business.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {business.itemsType.slice(0, 3).map((item) => (
            <Badge key={getItemTypeLabel(item)} variant="outline" className="text-xs">
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
