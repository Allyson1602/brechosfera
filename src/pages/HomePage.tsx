import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessDetail } from "@/components/business/BusinessDetail";
import { BusinessSearchField } from "@/components/business/BusinessSearchField";
import { BusinessMap } from "@/components/map/BusinessMap";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { appConfig } from "@/config/app.config";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getItemTypeSearchValue } from "@/lib/business/itemTypeLabels";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocationLabel, setUserLocationLabel] = useState<string>(
    `${appConfig.defaultLocation.city}, ${appConfig.defaultLocation.state}`,
  );

  const physicalBusinesses = useMemo(() => {
    const dataItems = data?.findAllLocalBaazars || [];
    return dataItems.filter((business) => !business.isOnline);
  }, [data]);

  const filteredBusinesses = useMemo(() => {
    if (!searchQuery.trim()) return physicalBusinesses;

    const query = searchQuery.trim().toLowerCase();

    return physicalBusinesses.filter((business) => {
      return (
        business.name.toLowerCase().includes(query) ||
        (business.description || "").toLowerCase().includes(query) ||
        (business.address || "").toLowerCase().includes(query) ||
        business.itemsType.some((item) =>
          getItemTypeSearchValue(item).includes(query),
        )
      );
    });
  }, [physicalBusinesses, searchQuery]);

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

        const locationData = await response.json();
        setLocationFromAddress(locationData?.address);
      } catch {
        // mantém fallback configurado no appConfig
      }
    };

    void resolveUserLocation();

    return () => controller.abort();
  }, [geoError, geoLoading, latitude, longitude]);

  const hasBusinesses = filteredBusinesses.length > 0;

  return (
    <div className="bg-transparent lg:flex lg:h-[calc(100dvh-4rem)] lg:min-h-0 lg:flex-col lg:overflow-hidden">
      <section className="bg-transparent px-4 pt-6 lg:shrink-0 lg:pb-2 lg:pt-3 md:pt-8">
        <div className="container mx-auto text-center">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            Descubra <span className="text-primary">achados únicos</span> perto
            de você
          </h1>

          <div className="mt-3 flex items-center justify-center gap-2 text-sm">
            {geoLoading ? (
              <div className="flex gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Obtendo sua localização...</span>
              </div>
            ) : geoError ? (
              <div className="flex gap-2 text-muted-foreground">
                <span>Usando localização padrão: {userLocationLabel}</span>
              </div>
            ) : (
              <div className="flex gap-2 text-primary">
                <span>Resultados próximos de: {userLocationLabel}</span>
              </div>
            )}
          </div>

          <div className="container mx-auto px-4 pt-6 lg:pt-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-8">
              <BusinessSearchField
                value={searchQuery}
                onChange={setSearchQuery}
                inputClassName="max-w-lg"
              />
              <Tabs
                value={viewMode}
                onValueChange={(value) => setViewMode(value as "map" | "list")}
              >
                <TabsList className="grid w-[160px] grid-cols-2">
                  <TabsTrigger value="map" className="gap-1">
                    <MapPin className="h-4 w-4" />
                    Mapa
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-1">
                    <List className="h-4 w-4" />
                    Lista
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-5 pt-2 lg:min-h-0 lg:flex-1 lg:pb-3">
        {viewMode === "map" ? (
          <div className="grid h-full gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-[68dvh] min-h-[320px] overflow-hidden rounded-lg shadow-lg sm:h-[70dvh] lg:h-full lg:min-h-0">
              {loading ? (
                <LoadingPanel message="Carregando os pontos no mapa para você." />
              ) : (
                <BusinessMap
                  businesses={filteredBusinesses}
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
                    : `${filteredBusinesses.length} lojinha${filteredBusinesses.length !== 1 ? "s" : ""} encontrada${filteredBusinesses.length !== 1 ? "s" : ""}`}
                </h2>
              </div>
              {loading ? (
                <LoadingCards />
              ) : error ? (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-muted-foreground">
                  Não foi possível carregar as lojas agora.
                </div>
              ) : hasBusinesses ? (
                <div className="space-y-3">
                  {filteredBusinesses.map((business) => (
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
              <h2 className="text-lg font-semibold">
                {loading
                  ? "Buscando lojas..."
                  : `${filteredBusinesses.length} lojinha${filteredBusinesses.length !== 1 ? "s" : ""} encontrada${filteredBusinesses.length !== 1 ? "s" : ""}`}
              </h2>
            </div>
            {loading ? (
              <LoadingCards />
            ) : error ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-muted-foreground">
                Não foi possível carregar as lojas agora.
              </div>
            ) : hasBusinesses ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredBusinesses.map((business) => (
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
