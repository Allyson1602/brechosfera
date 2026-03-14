import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessDetail } from "@/components/business/BusinessDetail";
import { BusinessMap } from "@/components/map/BusinessMap";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { appConfig } from "@/config/app.config";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Baazar } from "@/lib/graphql/generated";
import { GET_LOCAL_BAAZARS } from "@/lib/graphql/queries/business";
import { useQuery } from "@apollo/client/react";
import { List, Loader2, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function LoadingPanel({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center rounded-lg border border-border/60 bg-muted/30 px-6 text-center">
      <div className="space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Buscando lojas</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}

function LoadingCards() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm"
        >
          <div className="animate-pulse space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            </div>
            <div className="h-3 w-1/3 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { loading, error, data } = useQuery<{ findAllLocalBaazars: Baazar[] }>(
    GET_LOCAL_BAAZARS,
  );

  const {
    latitude,
    longitude,
    loading: geoLoading,
    error: geoError,
  } = useGeolocation();

  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedBusiness, setSelectedBusiness] = useState<Baazar | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [userLocationLabel, setUserLocationLabel] = useState<string>(
    `${appConfig.defaultLocation.city}, ${appConfig.defaultLocation.state}`,
  );

  const physicalBusinesses = useMemo(() => {
    const dataItems = data?.findAllLocalBaazars || [];
    return dataItems.filter((b) => !b.isOnline);
  }, [data]);

  const handleBusinessClick = (business: Baazar) => {
    setSelectedBusiness(business);
    setDetailOpen(true);
  };

  useEffect(() => {
    if (geoLoading) return;

    const controller = new AbortController();

    const setLocationFromAddress = (address?: Record<string, string>) => {
      if (!address) return;

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county;
      const state = address.state_code || address.region_code || address.state;

      if (!city && !state) return;
      setUserLocationLabel([city, state].filter(Boolean).join(", "));
    };

    const resolveUserLocation = async () => {
      try {
        if (geoError) {
          const ipResponse = await fetch("https://ipapi.co/json/", {
            signal: controller.signal,
          });
          if (!ipResponse.ok) return;

          const ipData = await ipResponse.json();
          const city = ipData?.city;
          const state = ipData?.region_code || ipData?.region;

          if (!city && !state) return;
          setUserLocationLabel([city, state].filter(Boolean).join(", "));
          return;
        }

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=pt-BR`,
          { signal: controller.signal },
        );

        if (!response.ok) return;

        const data = await response.json();
        setLocationFromAddress(data?.address);
      } catch {
        // mantem fallback configurado no appConfig
      }
    };

    void resolveUserLocation();

    return () => controller.abort();
  }, [geoError, geoLoading, latitude, longitude]);

  const hasBusinesses = physicalBusinesses.length > 0;

  return (
    <div className="min-h-[calc(100dvh-4rem)] overflow-y-auto lg:h-[calc(100dvh-4rem)] lg:min-h-0 lg:overflow-hidden lg:flex lg:flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-accent to-background pt-6 md:pt-8 pb-4 px-4 lg:pt-3 lg:pb-2 lg:shrink-0">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Descubra <span className="text-primary">achados unicos</span> <br />
            perto de voce
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {appConfig.description}
          </p>

          <div className="flex items-center justify-center gap-2 mt-3 text-sm">
            {geoLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Obtendo sua localizacao...</span>
              </div>
            ) : geoError ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Usando localizacao padrao: {userLocationLabel}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-4 h-4" />
                <span>Mostrando resultados proximos de: {userLocationLabel}</span>
              </div>
            )}
          </div>

          <div className="container mx-auto px-4 pt-6 lg:pt-2">
            <div className="flex items-center justify-end gap-4">
              <Tabs
                value={viewMode}
                onValueChange={(v) => setViewMode(v as "map" | "list")}
              >
                <TabsList className="grid w-[160px] grid-cols-2">
                  <TabsTrigger value="map" className="gap-1">
                    <MapPin className="w-4 h-4" />
                    Mapa
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-1">
                    <List className="w-4 h-4" />
                    Lista
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-5 lg:py-3 lg:flex-1 lg:min-h-0">
        {viewMode === "map" ? (
          <div className="grid gap-4 lg:gap-5 h-full lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-[68dvh] min-h-[320px] sm:h-[70dvh] lg:h-full lg:min-h-0 rounded-lg overflow-hidden shadow-lg">
              {loading ? (
                <LoadingPanel message="Carregando os pontos no mapa para voce." />
              ) : (
                <BusinessMap
                  businesses={physicalBusinesses}
                  center={{ lat: latitude, lng: longitude }}
                  onBusinessClick={handleBusinessClick}
                  selectedBusinessId={selectedBusiness?.id}
                  showUserLocation={!geoLoading && !geoError}
                  userLocation={
                    !geoLoading && !geoError
                      ? { lat: latitude, lng: longitude }
                      : null
                  }
                  className="min-h-0"
                />
              )}
            </div>

            <div className="space-y-4 lg:max-h-full lg:overflow-y-auto lg:pr-1">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">
                  {loading
                    ? "Buscando lojas..."
                    : `${physicalBusinesses.length} loja${physicalBusinesses.length !== 1 ? "s" : ""} encontrada${physicalBusinesses.length !== 1 ? "s" : ""}`}
                </h2>
              </div>
              {loading ? (
                <LoadingCards />
              ) : error ? (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-muted-foreground">
                  Nao foi possivel carregar as lojas agora.
                </div>
              ) : hasBusinesses ? (
                <div className="space-y-3">
                  {physicalBusinesses.map((business) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                      variant="compact"
                      onClick={() => handleBusinessClick(business)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                  Nenhuma loja local foi encontrada no momento.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 lg:h-full lg:overflow-y-auto lg:pr-1">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                {loading
                  ? "Buscando lojas..."
                  : `${physicalBusinesses.length} loja${physicalBusinesses.length !== 1 ? "s" : ""} encontrada${physicalBusinesses.length !== 1 ? "s" : ""}`}
              </h2>
            </div>
            {loading ? (
              <LoadingCards />
            ) : error ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-muted-foreground">
                Nao foi possivel carregar as lojas agora.
              </div>
            ) : hasBusinesses ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {physicalBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    onClick={() => handleBusinessClick(business)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                Nenhuma loja local foi encontrada no momento.
              </div>
            )}
          </div>
        )}
      </div>

      <BusinessDetail
        business={selectedBusiness}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
