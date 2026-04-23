import { EventCard } from "@/components/events/EventCard";
import { BusinessSearchField } from "@/components/business/BusinessSearchField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { eventsConfig } from "@/config/events.config";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  CalendarPlus2,
  Clock,
  MapPin,
  Sparkles,
  Store,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import type { Event, EventStatus } from "@/types/event";

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

function LoadingCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm"
        >
          <div className="h-48 animate-pulse bg-muted" />
          <div className="space-y-4 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="flex gap-2">
              <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ activeTab }: { activeTab: EventStatus }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/70 px-6 py-14 text-center">
      <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">
        {activeTab === "ongoing"
          ? "Nenhum evento acontecendo agora"
          : activeTab === "upcoming"
            ? "Nenhum evento programado"
            : "Nenhum evento encerrado"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {activeTab === "upcoming"
          ? "Novos encontros publicados aparecerão aqui em breve."
          : activeTab === "ongoing"
            ? "Quando houver encontro ativo, esta aba mostrará os detalhes principais para você se organizar."
            : "Os eventos já finalizados aparecerão aqui para consulta."}
      </p>
    </div>
  );
}

export default function EventsPage() {
  const navigate = useNavigate();
  const {
    loading: eventsLoading,
    error: eventsQueryError,
    data: eventsData,
  } = useQuery<EventsQueryData>(GET_EVENTS);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EventStatus>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  const allEvents = useMemo(() => {
    const backendEvents: Event[] = (eventsData?.findAllEvents || []).map(
      (event) => ({
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
        coverImage: resolveImageSrc(
          event.coverImage,
          eventsConfig.defaultCoverImage,
        ),
        startDate: event.startDate,
        endDate: event.endDate,
        address: event.address || undefined,
        status: resolveEventStatus(event.startDate, event.endDate),
        isPublished: event.isPublished ?? true,
        tags: event.tags || [],
        createdAt: event.createdAt,
      }),
    );

    return backendEvents.map((event) => ({
      ...event,
      status: resolveEventStatus(event.startDate, event.endDate),
    }));
  }, [eventsData]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allEvents.filter((event) => {
      if (!event.isPublished || event.status !== activeTab) return false;
      if (!query) return true;

      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        (event.business?.name || "").toLowerCase().includes(query) ||
        (event.address?.neighborhood || "").toLowerCase().includes(query) ||
        (event.address?.city || "").toLowerCase().includes(query) ||
        event.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [activeTab, allEvents, searchQuery]);

  const publishedEventsCount = allEvents.filter((event) => event.isPublished).length;

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setDetailOpen(true);
  };

  return (
    <div className="bg-transparent">
      <section className="relative overflow-hidden px-4 py-10 md:py-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_30rem),linear-gradient(180deg,hsl(var(--accent)/0.72),transparent)]" />

        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 rounded-full px-4 py-1.5" variant="secondary">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              Encontros para garimpar com mais planejamento
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              Veja eventos presenciais com data, bairro e organização de forma
              simples
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              Mantivemos o mesmo foco da home: destacar o que ajuda na decisão
              real, como quando acontece, onde é, quem organiza e quais temas
              podem interessar.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            <BusinessSearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por evento, bairro, cidade ou tema..."
              inputClassName="h-12 rounded-full bg-card/95 pl-11 shadow-sm"
            />
          </div>

          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm backdrop-blur">
              <Calendar className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Planejamento mais fácil</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Data, horário e bairro em destaque já no card.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm backdrop-blur">
              <Store className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Organização visível</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Veja rapidamente qual loja está por trás do evento.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm backdrop-blur">
              <CalendarPlus2 className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Agenda em movimento</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Acompanhe o que está acontecendo agora ou vem por aí.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-12">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Eventos para acompanhar</h2>
            <p className="text-sm text-muted-foreground">
              {eventsLoading
                ? "Buscando eventos publicados..."
                : `${filteredEvents.length} evento${filteredEvents.length !== 1 ? "s" : ""} nesta visualização`}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm shadow-sm">
              Total de eventos publicados:{" "}
              <strong>{publishedEventsCount}</strong>
            </div>
            <Button onClick={() => navigate("/eventos/criar")} className="rounded-full">
              Criar evento
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as EventStatus)}
          >
            <TabsList className="h-auto flex-wrap gap-2 rounded-2xl bg-transparent p-0">
              <TabsTrigger
                value="ongoing"
                className="rounded-full border border-border/60 bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Acontecendo
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="rounded-full border border-border/60 bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Em breve
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="rounded-full border border-border/60 bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Encerrados
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {eventsQueryError ? (
          <div className="rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-14 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">Não foi possível carregar os eventos</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente novamente em alguns instantes.
            </p>
          </div>
        ) : eventsLoading ? (
          <LoadingCards />
        ) : filteredEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        ) : (
          <EmptyState activeTab={activeTab} />
        )}
      </main>

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg">
          {selectedEvent && (
            <div>
              <div className="relative h-64 bg-muted/40">
                <img
                  src={resolveImageSrc(
                    selectedEvent.coverImage,
                    eventsConfig.defaultCoverImage,
                  )}
                  alt={selectedEvent.title}
                  className="h-full w-full object-contain p-4"
                />
              </div>

              <div className="p-6">
                <SheetHeader className="mb-4 text-left">
                  <div className="mb-2 flex items-center gap-2">
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

                  <SheetTitle className="text-2xl">
                    {selectedEvent.title}
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Detalhes do evento {selectedEvent.title}, incluindo data,
                    horário, local e organização.
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {format(
                          new Date(selectedEvent.startDate),
                          "d 'de' MMMM 'de' yyyy",
                          { locale: ptBR },
                        )}
                      </p>
                      {format(
                        new Date(selectedEvent.startDate),
                        "yyyy-MM-dd",
                      ) !==
                        format(
                          new Date(selectedEvent.endDate),
                          "yyyy-MM-dd",
                        ) && (
                        <p className="text-sm text-muted-foreground">
                          até{" "}
                          {format(
                            new Date(selectedEvent.endDate),
                            "d 'de' MMMM 'de' yyyy",
                            { locale: ptBR },
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {format(new Date(selectedEvent.startDate), "HH:mm")} -{" "}
                        {format(new Date(selectedEvent.endDate), "HH:mm")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      {selectedEvent.address ? (
                        <>
                          <p className="font-medium">
                            {selectedEvent.address.street},{" "}
                            {selectedEvent.address.number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedEvent.address.neighborhood},{" "}
                            {selectedEvent.address.city} -{" "}
                            {selectedEvent.address.state}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Local ainda não informado.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-5" />

                <div>
                  <h4 className="mb-2 font-semibold">Sobre o evento</h4>
                  <p className="text-muted-foreground">
                    {selectedEvent.description}
                  </p>
                </div>

                {selectedEvent.business && (
                  <>
                    <Separator className="my-5" />
                    <div>
                      <h4 className="mb-3 font-semibold">Organizado por</h4>
                      <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card p-1.5">
                          <img
                            src={resolveImageSrc(
                              selectedEvent.business.coverImage,
                            )}
                            alt={selectedEvent.business.name}
                            className="h-full w-full rounded-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-muted-foreground">Loja</p>
                          <p className="truncate font-medium">
                            {selectedEvent.business.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedEvent.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        #{tag}
                      </Badge>
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
