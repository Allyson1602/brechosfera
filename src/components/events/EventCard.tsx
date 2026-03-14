import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { resolveImageSrc } from '@/lib/images/resolveImageSrc';
import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const statusConfig = {
  upcoming: { label: 'Em Breve', className: 'bg-primary' },
  ongoing: { label: 'Acontecendo Agora', className: 'bg-green-500' },
  past: { label: 'Encerrado', className: 'bg-muted text-muted-foreground' },
};

export function EventCard({ event, onClick }: EventCardProps) {
  const status = statusConfig[event.status];
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const coverSrc = resolveImageSrc(event.coverImage);
  const businessCoverSrc = resolveImageSrc(event.business?.coverImage);

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-border/50 group"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={coverSrc}
          alt={event.title}
          className="w-full h-40 object-cover transition-transform group-hover:scale-105"
        />
        <Badge className={`absolute top-3 left-3 ${status.className}`}>
          {status.label}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>
              {format(startDate, "d 'de' MMMM", { locale: ptBR })}
              {format(startDate, 'yyyy-MM-dd') !== format(endDate, 'yyyy-MM-dd') && (
                <> - {format(endDate, "d 'de' MMMM", { locale: ptBR })}</>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>
              {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
            </span>
          </div>

          {event.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="truncate">
                {event.address.neighborhood}, {event.address.city}
              </span>
            </div>
          )}
        </div>

        {event.business && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <img
              src={businessCoverSrc}
              alt={event.business.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-muted-foreground truncate">
              {event.business.name}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
