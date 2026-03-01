import { useState, useMemo } from "react";
import { Globe, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessDetail } from "@/components/business/BusinessDetail";
import { mockBusinesses } from "@/data/mockData";
import { appConfig } from "@/config/app.config";
import type { Business, BusinessCategory } from "@/types/business";

export default function OnlinePage() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    BusinessCategory | "all"
  >("all");

  const onlineBusinesses = useMemo(() => {
    return mockBusinesses.filter((b) => {
      if (!b.isOnline) return false;
      if (categoryFilter !== "all" && b.category !== categoryFilter)
        return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.itemTypes.some((item) => item.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [categoryFilter, searchQuery]);

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-accent to-background pt-8 pb-4 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Bazares e Brechós <span className="text-primary">Online</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Compre de qualquer lugar do Brasil! Encontre os melhores brechós e
            bazares que vendem online.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="sticky pt-9 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, descrição ou tipo de item..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={categoryFilter === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCategoryFilter("all")}
                >
                  Todos
                </Badge>
                {appConfig.activeCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={categoryFilter === cat ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {appConfig.categories[cat].label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {onlineBusinesses.length === 0 ? (
          <div className="text-center py-16">
            <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Nenhum resultado encontrado
            </h2>
            <p className="text-muted-foreground">
              Tente ajustar sua busca ou filtros para encontrar mais opções.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="font-semibold text-lg">
                {onlineBusinesses.length} loja
                {onlineBusinesses.length !== 1 ? "s" : ""} online encontrada
                {onlineBusinesses.length !== 1 ? "s" : ""}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {onlineBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={{
                    ...business,
                    itemsType: business.itemTypes || [],
                    description: business.description || "",
                  }}
                  onClick={() => handleBusinessClick(business)}
                />
              ))}
            </div>
          </>
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
