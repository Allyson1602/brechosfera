import {
  MapPin,
  Star,
  Globe,
  Phone,
  Mail,
  Instagram,
  ExternalLink,
  Clock,
  X,
  MessageCircle,
  ShoppingBag,
  Shirt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RatingInput } from "@/components/business/RatingInput";
import type { Business } from "@/types/business";

interface BusinessDetailProps {
  business: Business | null;
  open: boolean;
  onClose: () => void;
}

const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function BusinessDetail({
  business,
  open,
  onClose,
}: BusinessDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!business) return null;

  const allImages = [business.coverImage, ...(business.images || [])].filter(
    (img, index, self) => self.indexOf(img) === index,
  );

  const CategoryIcon = business.category === "bazar" ? ShoppingBag : Shirt;

  const handleWhatsApp = () => {
    if (business.contact.whatsapp) {
      window.open(`https://wa.me/${business.contact.whatsapp}`, "_blank");
    }
  };

  const handleInstagram = () => {
    if (business.contact.instagram) {
      const handle = business.contact.instagram.replace("@", "");
      window.open(`https://instagram.com/${handle}`, "_blank");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        <div className="relative">
          {/* Image Gallery */}
          <div className="relative h-64 bg-muted">
            <img
              src={allImages[currentImageIndex]}
              alt={business.name}
              className="w-full h-full object-cover"
            />
            {allImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/40 backdrop-blur-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" color="#000" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/40 backdrop-blur-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" color="#000" />
                </Button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? "bg-primary"
                          : "bg-card/60"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}

            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 rounded-full bg-card/40 backdrop-blur-sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" color="#000" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <SheetHeader className="text-left mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  <CategoryIcon className="w-3 h-3 mr-1" />
                  {business.category === "bazar" ? "Bazar" : "Brechó"}
                </Badge>
                {business.isOnline && (
                  <Badge className="bg-primary">
                    <Globe className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                )}
              </div>
              <SheetTitle className="text-2xl">{business.name}</SheetTitle>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{business.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({business.reviewCount} avaliações)
                </span>
              </div>
            </SheetHeader>

            {/* Location */}
            {!business.isOnline && business.address && (
              <div className="flex items-start gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">
                    {business.address.street}, {business.address.number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {business.address.neighborhood}, {business.address.city} -{" "}
                    {business.address.state}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-muted-foreground mb-4">{business.description}</p>

            {/* Item Types */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Tipos de Itens</h4>
              <div className="flex flex-wrap gap-2">
                {business.itemTypes.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Operating Hours */}
            {business.operatingHours.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horário de Funcionamento
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {business.operatingHours.map((hours) => (
                    <div key={hours.dayOfWeek} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {dayNames[hours.dayOfWeek]}
                      </span>
                      <span>
                        {hours.isClosed
                          ? "Fechado"
                          : `${hours.openTime} - ${hours.closeTime}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-4" />

            {/* Contact Actions */}
            <div className="space-y-3">
              {business.contact.whatsapp && (
                <Button className="w-full gap-2" onClick={handleWhatsApp}>
                  <MessageCircle className="w-4 h-4" />
                  Enviar WhatsApp
                </Button>
              )}

              {business.contact.instagram && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleInstagram}
                >
                  <Instagram className="w-4 h-4" />
                  {business.contact.instagram}
                </Button>
              )}

              {business.contact.phone && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => window.open(`tel:${business.contact.phone}`)}
                >
                  <Phone className="w-4 h-4" />
                  {business.contact.phone}
                </Button>
              )}

              {business.contact.email && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() =>
                    window.open(`mailto:${business.contact.email}`)
                  }
                >
                  <Mail className="w-4 h-4" />
                  {business.contact.email}
                </Button>
              )}

              {business.contact.website && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() =>
                    window.open(business.contact.website, "_blank")
                  }
                >
                  <ExternalLink className="w-4 h-4" />
                  Visitar Site
                </Button>
              )}
            </div>

            <Separator className="my-4" />

            {/* Rating Input */}
            <RatingInput
              businessId={business.id}
              businessName={business.name}
            />

            {/* Tags */}
            {business.tags.length > 0 && (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
