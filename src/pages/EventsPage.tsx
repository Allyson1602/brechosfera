import { useMemo, useState } from "react";
import { Calendar, Clock, MapPin, ChevronRight, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { EventCard } from "@/components/events/EventCard";
import { eventsConfig } from "@/config/events.config";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import type { Event, EventStatus } from "@/types/event";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";

const GET_EVENTS = gql`
  query GetEvents {
    findAllEvents {
      id
      title
      description
      businessId
      coverImage
      startDate
      endDate
      isPublished
      tags
      createdAt
      address {
        street
        number
        neighborhood
        city
        state
        zipCode
        latitude
        longitude
      }
      business {
        id
        name
        logoImage
      }
    }
  }
`;

type EventsQueryData = {
  findAllEvents: Array<{
    id: string;
    title: string;
    description: string;
    businessId?: string;
    coverImage?: string | null;
    startDate: string;
    endDate: string;
    isPublished?: boolean | null;
    tags?: string[] | null;
    createdAt: string;
    address?: {
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
      latitude: number;
      longitude: number;
    } | null;
    business?: {
      id: string;
      name: string;
      logoImage?: string | null;
    } | null;
  }>;
};

function resolveEventStatus(startDate: string, endDate: string): EventStatus {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "upcoming";
  if (now > end) return "past";
  return "ongoing";
}

export default function EventsPage() {
  const navigate = useNavigate();
  const { loading: eventsLoading, error: eventsQueryError, data: eventsData } =
    useQuery<EventsQueryData>(GET_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EventStatus>("upcoming");

  const allEvents = useMemo(() => {
    const backendEvents: Event[] = (eventsData?.findAllEvents || []).map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      businessId: event.businessId || "",
      business: event.business
        ? {
            id: event.business.id,
            name: event.business.name,
            coverImage: resolveImageSrc(event.business.logoImage || ""),
          }
        : undefined,
      coverImage: resolveImageSrc(event.coverImage, eventsConfig.defaultCoverImage),
      startDate: event.startDate,
      endDate: event.endDate,
      address: event.address || undefined,
      status: resolveEventStatus(event.startDate, event.endDate),
      isPublished: event.isPublished ?? true,
      tags: event.tags || [],
      createdAt: event.createdAt,
    }));

    return backendEvents.map((event) => ({
      ...event,
      status: resolveEventStatus(event.startDate, event.endDate),
    }));
  }, [eventsData]);

  const filteredEvents = useMemo(
    () => allEvents.filter((event) => event.isPublished && event.status === activeTab),
    [allEvents, activeTab],
  );

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setDetailOpen(true);
  };

  return (
    <div>
      <section className="bg-transparent py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-primary">Eventos</span> presenciais
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Descubra os eventos ja criados e veja os detalhes de cada encontro.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-primary" />
                Criar novo evento
              </CardTitle>
              <CardDescription>
                Os eventos sao exclusivamente presenciais.
              </CardDescription>
            </div>
            <Button onClick={() => navigate("/eventos/criar")}>Criar evento</Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total de eventos presenciais publicados: <strong>{allEvents.filter((event) => event.isPublished).length}</strong>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="sticky top-16 z-40 border-b border-border/50">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EventStatus)}>
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-0">
              <TabsTrigger
                value="ongoing"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-4 px-6"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Acontecendo
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-4 px-6"
              >
                Em breve
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-4 px-6"
              >
                Encerrados
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {eventsQueryError && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            Nao foi possivel carregar eventos do backend GraphQL.
          </div>
        )}
        {eventsLoading ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Carregando eventos...</h2>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Nenhum evento {activeTab === "ongoing" ? "acontecendo" : activeTab === "upcoming" ? "programado" : "encerrado"}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === "upcoming"
                ? "Novos eventos publicados aparecerao em breve."
                : activeTab === "ongoing"
                  ? "Nao ha eventos publicados acontecendo no momento."
                  : "Eventos encerrados e publicados aparecerao aqui."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="font-semibold text-lg">
                {filteredEvents.length} evento{filteredEvents.length !== 1 ? "s" : ""}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onClick={() => handleEventClick(event)} />
              ))}
            </div>
          </>
        )}
      </div>

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
          {selectedEvent && (
            <div>
              <img src={resolveImageSrc(selectedEvent.coverImage, eventsConfig.defaultCoverImage)} alt={selectedEvent.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <SheetHeader className="text-left mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={
                        selectedEvent.status === "ongoing"
                          ? "bg-green-500"
                          : selectedEvent.status === "upcoming"
                            ? "bg-primary"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {selectedEvent.status === "ongoing"
                        ? "Acontecendo agora"
                        : selectedEvent.status === "upcoming"
                          ? "Em breve"
                          : "Encerrado"}
                    </Badge>
                  </div>
                  <SheetTitle className="text-2xl">{selectedEvent.title}</SheetTitle>
                  <SheetDescription className="sr-only">
                    Detalhes do evento {selectedEvent.title}, incluindo data, horario, local e organizador.
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {format(new Date(selectedEvent.startDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                      {format(new Date(selectedEvent.startDate), "yyyy-MM-dd") !==
                        format(new Date(selectedEvent.endDate), "yyyy-MM-dd") && (
                          <p className="text-sm text-muted-foreground">
                            ate {format(new Date(selectedEvent.endDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {format(new Date(selectedEvent.startDate), "HH:mm")} - {format(new Date(selectedEvent.endDate), "HH:mm")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      {selectedEvent.address ? (
                        <>
                          <p className="font-medium">
                            {selectedEvent.address.street}, {selectedEvent.address.number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedEvent.address.neighborhood}, {selectedEvent.address.city} - {selectedEvent.address.state}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Local ainda nao informado.</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Sobre o evento</h4>
                  <p className="text-muted-foreground">{selectedEvent.description}</p>
                </div>

                {selectedEvent.business && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-semibold mb-3">Organizado por</h4>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <img
                          src={resolveImageSrc(selectedEvent.business.coverImage)}
                          alt={selectedEvent.business.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{selectedEvent.business.name}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </>
                )}

                {selectedEvent.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag) => (
                      <span key={tag} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}



