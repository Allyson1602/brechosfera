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
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [galleryLayout, setGalleryLayout] = useState<{
    columns: number;
    rows: 1 | 2;
  }>({ columns: 1, rows: 1 });

  useEffect(() => {
    setSelectedImage(null);
    setImageZoomOpen(false);
  }, [business?.id]);

  const allImages = useMemo(() => {
    if (!business) return [];

    return (business.images ?? [])
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

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || allImages.length === 0) return;

    const updateLayout = () => {
      const firstImageButton = gallery.querySelector<HTMLButtonElement>(
        "[data-gallery-image]",
      );
      const tileWidth = firstImageButton?.offsetWidth ?? 120;
      const gap = parseFloat(getComputedStyle(gallery).columnGap) || 8;
      const availableWidth = gallery.clientWidth;
      const columns = Math.max(
        1,
        Math.floor((availableWidth + gap) / (tileWidth + gap)),
      );
      const rows = allImages.length > columns ? 2 : 1;

      setGalleryLayout((currentLayout) => {
        if (currentLayout.columns === columns && currentLayout.rows === rows) {
          return currentLayout;
        }

        return { columns, rows };
      });
    };

    updateLayout();

    const animationFrame = window.requestAnimationFrame(updateLayout);
    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(gallery);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [allImages.length, open]);

  const galleryImages = useMemo(() => {
    if (galleryLayout.rows === 1) return allImages;

    const pageSize = galleryLayout.columns * 2;
    const orderedImages: string[] = [];

    for (let pageStart = 0; pageStart < allImages.length; pageStart += pageSize) {
      const pageImages = allImages.slice(pageStart, pageStart + pageSize);

      for (let column = 0; column < galleryLayout.columns; column += 1) {
        const topImage = pageImages[column];
        const bottomImage = pageImages[galleryLayout.columns + column];

        if (topImage) orderedImages.push(topImage);
        if (bottomImage) orderedImages.push(bottomImage);
      }
    }

    return orderedImages;
  }, [allImages, galleryLayout]);

  if (!business) return null;

  const itemTypes = business.itemsType ?? [];
  const openingHours = normalizeStringList(business.openingHours);
  const rating = calculateRating(business.evaluations);
  const whatsappUrl = buildWhatsAppUrl(business.linkWhatsapp);
  const instagramUrl = buildInstagramUrl(business.linkInstagram);
  const currentImage = selectedImage ?? allImages[0];
  const selectedImageIndex = Math.max(allImages.indexOf(currentImage), 0);

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
    const nextIndex = (selectedImageIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  };

  const prevImage = () => {
    if (allImages.length === 0) return;
    const prevIndex =
      (selectedImageIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg lg:max-w-xl">
        <div className="relative">
          <Button
            size="icon"
            className="absolute right-3 top-3 z-10 rounded-full bg-background/80 text-primary shadow-sm backdrop-blur-sm hover:bg-background/90"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="p-6">
            <SheetHeader className="mb-5 text-left">
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

              {!business.isOnline && business.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="break-words text-sm">{business.address}</p>
                </div>
              )}

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

            {allImages.length > 0 ? (
              <div className="mb-6">
                <h4 className="mb-3 font-semibold">Fotos da loja</h4>

                <div
                  ref={galleryRef}
                  className={`scrollbar-none grid auto-cols-[7.5rem] grid-flow-col gap-2 overflow-x-auto pb-2 sm:auto-cols-[8rem] ${
                    galleryLayout.rows === 2 ? "grid-rows-2" : "grid-rows-1"
                  }`}
                >
                  {galleryImages.map((image) => (
                    <button
                      key={image}
                      type="button"
                      data-gallery-image
                      className={`group relative aspect-square overflow-hidden rounded-lg border bg-muted/40 transition ${
                        image === selectedImage
                          ? "border-primary ring-2 ring-primary/25"
                          : "border-border/60 hover:border-primary/60"
                      }`}
                      onClick={() => {
                        setSelectedImage(image);
                        setImageZoomOpen(true);
                      }}
                    >
                      <img
                        src={image}
                        alt={`${business.name} - foto ${
                          allImages.indexOf(image) + 1
                        }`}
                        draggable={false}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 flex h-36 items-center justify-center rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground">
                Imagem indisponível
              </div>
            )}

            {business.description && (
              <p className="font-hand text-xl leading-6 text-gray-600 mb-8">
                {business.description}
              </p>
            )}

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

      <Dialog open={imageZoomOpen} onOpenChange={setImageZoomOpen}>
        <DialogContent className="max-w-[min(94vw,1100px)] border-0 bg-transparent p-0 shadow-none [&>button]:right-3 [&>button]:top-3 [&>button]:rounded-full [&>button]:bg-background/80 [&>button]:text-primary [&>button]:shadow-sm [&>button]:backdrop-blur-sm [&>button]:hover:bg-background/90">
          <DialogTitle className="sr-only">
            Imagem ampliada de {business.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Visualização ampliada da imagem selecionada da loja.
          </DialogDescription>
          {currentImage && (
            <div className="relative flex h-[88vh] items-center justify-center">
              <img
                src={currentImage}
                alt={business.name}
                className="max-h-full w-full rounded-2xl object-contain"
              />

              {allImages.length > 1 && (
                <>
                  <Button
                    type="button"
                    size="icon"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 text-primary shadow-sm backdrop-blur-sm hover:bg-background/90"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">Imagem anterior</span>
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 text-primary shadow-sm backdrop-blur-sm hover:bg-background/90"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                    <span className="sr-only">Próxima imagem</span>
                  </Button>

                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-background/80 px-3 py-2 shadow-sm backdrop-blur-sm">
                    {allImages.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        className={`h-2.5 w-2.5 rounded-full transition-colors ${
                          index === selectedImageIndex
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                        onClick={() => setSelectedImage(image)}
                      >
                        <span className="sr-only">Ver imagem {index + 1}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
