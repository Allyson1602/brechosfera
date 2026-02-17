import { MapPin, Star, Globe, ShoppingBag, Shirt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Business } from "@/types/business";

interface BusinessCardProps {
  business: Business;
  onClick?: () => void;
  variant?: "default" | "compact";
}

export function BusinessCard({
  business,
  onClick,
  variant = "default",
}: BusinessCardProps) {
  const CategoryIcon = business.category === "bazar" ? ShoppingBag : Shirt;

  if (variant === "compact") {
    return (
      <Card
        className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-border/50"
        onClick={onClick}
      >
        <div className="flex gap-3 p-3">
          <img
            src={business.coverImage}
            alt={business.name}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CategoryIcon className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm truncate">
                {business.name}
              </h3>
            </div>
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
                    {business.address.neighborhood}
                  </span>
                </div>
              )
            )}
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{business.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({business.reviewCount})
              </span>
            </div>
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
          src={business.coverImage}
          alt={business.name}
          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-slate-500 backdrop-blur-sm">
            <CategoryIcon className="w-3 h-3 mr-1" />
            {business.category === "bazar" ? "Bazar" : "Brechó"}
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
          <span className="text-sm font-semibold">{business.rating}</span>
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
              {business.address.neighborhood}, {business.address.city}
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
          {business.itemTypes.slice(0, 3).map((item) => (
            <Badge key={item} variant="outline" className="text-xs">
              {item}
            </Badge>
          ))}
          {business.itemTypes.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{business.itemTypes.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
