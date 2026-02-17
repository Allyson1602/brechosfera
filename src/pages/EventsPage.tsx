import { useState, useMemo } from "react";
import { Calendar, Clock, MapPin, Globe, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { EventCard } from "@/components/events/EventCard";
import { mockEvents } from "@/data/mockData";
import type { Event, EventStatus } from "@/types/event";

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EventStatus>("upcoming");

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => event.status === activeTab);
  }, [activeTab]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-accent to-background py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-primary">Eventos</span> e Promoções
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Fique por dentro dos melhores eventos, bazares especiais e promoções
            imperdíveis!
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-card/95 backdrop-blur border-b border-border/50">
        <div className="container mx-auto px-4">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as EventStatus)}
          >
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
                Em Breve
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

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Nenhum evento{" "}
              {activeTab === "ongoing"
                ? "acontecendo"
                : activeTab === "upcoming"
                ? "programado"
                : "passado"}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === "upcoming"
                ? "Novos eventos serão anunciados em breve!"
                : activeTab === "ongoing"
                ? "Não há eventos acontecendo no momento."
                : "Eventos passados aparecerão aqui."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="font-semibold text-lg">
                {filteredEvents.length} evento
                {filteredEvents.length !== 1 ? "s" : ""}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Event Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
          {selectedEvent && (
            <div>
              <img
                src={selectedEvent.coverImage}
                alt={selectedEvent.title}
                className="w-full h-56 object-cover"
              />
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
                        ? "Acontecendo Agora"
                        : selectedEvent.status === "upcoming"
                        ? "Em Breve"
                        : "Encerrado"}
                    </Badge>
                    {selectedEvent.isOnline && (
                      <Badge variant="outline">
                        <Globe className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    )}
                  </div>
                  <SheetTitle className="text-2xl">
                    {selectedEvent.title}
                  </SheetTitle>
                </SheetHeader>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {format(
                          new Date(selectedEvent.startDate),
                          "d 'de' MMMM 'de' yyyy",
                          { locale: ptBR }
                        )}
                      </p>
                      {format(selectedEvent.startDate, "yyyy-MM-dd") !==
                        format(selectedEvent.endDate, "yyyy-MM-dd") && (
                        <p className="text-sm text-muted-foreground">
                          até{" "}
                          {format(
                            new Date(selectedEvent.endDate),
                            "d 'de' MMMM 'de' yyyy",
                            { locale: ptBR }
                          )}
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
                        {format(new Date(selectedEvent.startDate), "HH:mm")} -{" "}
                        {format(new Date(selectedEvent.endDate), "HH:mm")}
                      </p>
                    </div>
                  </div>

                  {!selectedEvent.isOnline && selectedEvent.address && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {selectedEvent.address.street},{" "}
                          {selectedEvent.address.number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEvent.address.neighborhood},{" "}
                          {selectedEvent.address.city} -{" "}
                          {selectedEvent.address.state}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Sobre o Evento</h4>
                  <p className="text-muted-foreground">
                    {selectedEvent.description}
                  </p>
                </div>

                {selectedEvent.business && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-semibold mb-3">Organizado por</h4>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <img
                          src={selectedEvent.business.coverImage}
                          alt={selectedEvent.business.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">
                            {selectedEvent.business.name}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </>
                )}

                {selectedEvent.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {selectedEvent.isOnline &&
                  selectedEvent.onlineUrl &&
                  selectedEvent.status !== "past" && (
                    <Button
                      className="w-full mt-6"
                      onClick={() =>
                        window.open(selectedEvent.onlineUrl, "_blank")
                      }
                    >
                      Acessar Evento Online
                    </Button>
                  )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
