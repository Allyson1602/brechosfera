import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import type { Event } from "@/types/event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Store,
} from "lucide-react";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const statusConfig = {
  upcoming: {
    label: "Em breve",
    className: "bg-primary text-primary-foreground",
  },
  ongoing: {
    label: "Acontecendo agora",
    className: "bg-green-500 text-white",
  },
  past: {
    label: "Encerrado",
    className: "bg-muted text-muted-foreground",
  },
};

function formatDateLabel(startDate: Date, endDate: Date) {
  const sameDay =
    format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd");

  if (sameDay) {
    return format(startDate, "d 'de' MMMM", { locale: ptBR });
  }

  return `${format(startDate, "d 'de' MMM", { locale: ptBR })} - ${format(endDate, "d 'de' MMM", { locale: ptBR })}`;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const status = statusConfig[event.status];
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const coverSrc = resolveImageSrc(event.coverImage);
  const businessCoverSrc = resolveImageSrc(event.business?.coverImage);

  return (
    <Card
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="relative overflow-hidden bg-muted/30">
        <img
          src={coverSrc}
          alt={event.title}
          className="h-52 w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge className={`rounded-full shadow-sm ${status.className}`}>
            {status.label}
          </Badge>
          <Badge className="rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur">
            <Sparkles className="mr-1 h-3 w-3 text-primary" />
            Presencial
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-5">
        <div className="space-y-2">
          <div>
            <h3 className="line-clamp-2 text-xl font-bold">{event.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {event.description}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex items-center gap-2 rounded-2xl bg-muted/50 px-3 py-2">
            <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="truncate">
              {formatDateLabel(startDate, endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-muted/50 px-3 py-2">
            <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="truncate">
              {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-muted/50 px-3 py-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="truncate">
              {event.address
                ? `${event.address.neighborhood}, ${event.address.city}`
                : "Local sob confirmação"}
            </span>
          </div>
        </div>

        {event.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {event.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
            {event.tags.length > 3 && (
              <Badge variant="outline">+{event.tags.length - 3} temas</Badge>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {event.business ? (
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted/50 p-1.5">
                <img
                  src={businessCoverSrc}
                  alt={event.business.name}
                  className="h-full w-full rounded-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Organizado por</p>
                <p className="truncate text-sm font-medium">
                  {event.business.name}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Store className="h-4 w-4 text-primary" />
              Evento local
            </div>
          )}

          <Button size="sm" className="gap-2 rounded-full">
            Ver detalhes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
