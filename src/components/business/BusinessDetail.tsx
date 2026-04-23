import {
  MapPin,
  Star,
  Globe,
  Instagram,
  Clock,
  X,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RatingInput } from "@/components/business/RatingInput";
import { getItemTypeLabel } from "@/lib/business/itemTypeLabels";
import { Baazar } from "@/lib/graphql/generated";
import { calculateRating } from "@/helpers/calculateRating";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";

interface BusinessDetailProps {
  business: Baazar | null;
  open: boolean;
  onClose: () => void;
}

function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function buildWhatsAppUrl(value: unknown) {
  const firstValue = normalizeStringList(value)[0];

  if (!firstValue) return null;
  if (/^https?:\/\//i.test(firstValue)) return firstValue;

  const phone = firstValue.replace(/\D/g, "");
  return phone ? `https://wa.me/${phone}` : null;
}

function buildInstagramUrl(value: unknown) {
  const firstValue = normalizeStringList(value)[0];

  if (!firstValue) return null;
  if (/^https?:\/\//i.test(firstValue)) return firstValue;

  return `https://instagram.com/${firstValue.replace(/^@/, "")}`;
}

export function BusinessDetail({
  business,
  open,
  onClose,
}: BusinessDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [business?.id]);

  const allImages = useMemo(() => {
    if (!business) return [];

    return [business.logoImage, ...(business.images ?? [])]
      .map((image) => resolveImageSrc(image))
      .filter((image): image is string => !!image && image.trim().length > 0)
      .filter((image, index, self) => self.indexOf(image) === index);
  }, [business]);

  useEffect(() => {
    allImages.forEach((image) => {
      const preloadImage = new Image();
      preloadImage.src = image;
    });
  }, [allImages]);

  if (!business) return null;

  const itemTypes = business.itemsType ?? [];
  const openingHours = business.openingHours ?? [];
  const rating = calculateRating(business.evaluations);
  const whatsappUrl = buildWhatsAppUrl(business.linkWhatsapp);
  const instagramUrl = buildInstagramUrl(business.linkInstagram);

  const handleWhatsApp = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleInstagram = () => {
    if (instagramUrl) {
      window.open(instagramUrl, "_blank", "noopener,noreferrer");
    }
  };

  const nextImage = () => {
    if (allImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    if (allImages.length === 0) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg">
        <div className="relative">
          <div className="relative h-64 bg-muted/40">
            {allImages.length > 0 ? (
              allImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={business.name}
                  draggable={false}
                  fetchPriority={index === currentImageIndex ? "high" : "auto"}
                  className={`absolute inset-0 h-full w-full select-none object-contain p-4 transition-opacity duration-200 ${
                    index === currentImageIndex
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  }`}
                  onDragStart={(event) => event.preventDefault()}
                />
              ))
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                Imagem indisponível
              </div>
            )}

            {allImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/40 backdrop-blur-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" color="#000" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/40 backdrop-blur-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" color="#000" />
                </Button>

                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full transition-colors ${
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
              className="absolute right-3 top-3 rounded-full bg-card/40 backdrop-blur-sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" color="#000" />
            </Button>
          </div>

          <div className="p-6">
            <SheetHeader className="mb-4 text-left">
              <div className="mb-2 flex items-center gap-2">
                {business.isOnline && (
                  <Badge className="bg-primary">
                    <Globe className="mr-1 h-3 w-3" />
                    Online
                  </Badge>
                )}
              </div>
              <SheetTitle className="text-2xl">{business.name}</SheetTitle>
              <SheetDescription className="sr-only">
                Detalhes da loja {business.name}, incluindo imagens, descrição,
                contatos e avaliação.
              </SheetDescription>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{rating.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({rating.count} avaliações)
                </span>
              </div>
            </SheetHeader>

            {!business.isOnline && business.address && (
              <div className="mb-4 flex items-start gap-2">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="break-words text-sm">{business.address}</p>
                </div>
              </div>
            )}

            <p className="mb-4 text-muted-foreground">
              {business.description || "Sem descrição disponível."}
            </p>

            {itemTypes.length > 0 && (
              <div className="mb-4">
                <h4 className="mb-2 font-semibold">Tipos de Itens</h4>
                <div className="flex flex-wrap gap-2">
                  {itemTypes.map((item) => (
                    <Badge key={getItemTypeLabel(item)} variant="outline">
                      {getItemTypeLabel(item)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-4" />

            {openingHours.length > 0 && (
              <div className="mb-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold">
                  <Clock className="h-4 w-4" />
                  Horário de Funcionamento
                </h4>
                <div className="grid gap-2 text-sm">
                  {openingHours.map((hours) => (
                    <div
                      key={hours}
                      className="rounded-md border border-border/50 px-3 py-2 text-muted-foreground"
                    >
                      {hours}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-4" />

            <div className="space-y-3">
              {whatsappUrl && (
                <Button className="w-full gap-2" onClick={handleWhatsApp}>
                  <MessageCircle className="h-4 w-4" />
                  Enviar WhatsApp
                </Button>
              )}

              {instagramUrl && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleInstagram}
                >
                  <Instagram className="h-4 w-4" />
                  Abrir Instagram
                </Button>
              )}
            </div>

            <Separator className="my-4" />

            <RatingInput
              businessId={business.id}
              businessName={business.name}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
