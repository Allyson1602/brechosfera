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
import { useMemo, useState } from "react";

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
  // const [categoryFilter, setCategoryFilter] = useState<
  //   BusinessCategory | "all"
  // >("all");

  console.log("GraphQL Data:", { loading, error, data });

  const physicalBusinesses = useMemo(() => {
    const dataItems = data?.findAllLocalBaazars || [];

    return dataItems.filter((b) => {
      if (b.isOnline) return false;

      // if (categoryFilter !== "all" && b.category !== categoryFilter)
      //   return false;
      return true;
    });
  }, [loading]); // categoryFilter,

  const handleBusinessClick = (business: Baazar) => {
    setSelectedBusiness(business);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-accent to-background pt-8 pb-4 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Descubra <span className="text-primary">achados únicos</span> <br />
            perto de você
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {appConfig.description}
          </p>

          {/* Location Info */}
          <div className="flex items-center justify-center gap-2 mt-4 text-sm">
            {geoLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Obtendo sua localização...</span>
              </div>
            ) : geoError ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Usando localização padrão: São Paulo, SP</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-4 h-4" />
                <span>Mostrando resultados próximos a você</span>
              </div>
            )}
          </div>

          {/* Filters Bar */}
          <div className="container mx-auto px-4 pt-9">
            <div className="flex items-center justify-between gap-4">
              {/* Category Filter */}
              {/* <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <Badge
                  variant={categoryFilter === "all" ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setCategoryFilter("all")}
                >
                  Todos
                </Badge>
                {appConfig.activeCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={categoryFilter === cat ? "default" : "outline"}
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {appConfig.categories[cat].label}
                  </Badge>
                ))}
              </div> */}

              {/* View Toggle */}
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

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {viewMode === "map" ? (
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            {/* Map */}
            <div className="h-[500px] lg:h-[calc(100vh-280px)] rounded-lg overflow-hidden shadow-lg">
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
              />
            </div>

            {/* Sidebar List */}
            <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">
                  {physicalBusinesses.length} loja
                  {physicalBusinesses.length !== 1 ? "s" : ""} encontrado
                  {physicalBusinesses.length !== 1 ? "s" : ""}
                </h2>
              </div>
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
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                {physicalBusinesses.length} loja
                {physicalBusinesses.length !== 1 ? "s" : ""} encontrado
                {physicalBusinesses.length !== 1 ? "s" : ""}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {physicalBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onClick={() => handleBusinessClick(business)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Business Detail Sheet */}
      <BusinessDetail
        business={selectedBusiness}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
