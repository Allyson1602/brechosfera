import { useMemo, useState } from "react";
import { AlertCircle, Globe, Search } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessDetail } from "@/components/business/BusinessDetail";
import { getItemTypeSearchValue } from "@/lib/business/itemTypeLabels";
import { Baazar } from "@/lib/graphql/generated";
import { GET_ONLINE_BAAZARS } from "@/lib/graphql/queries/business";

export default function OnlinePage() {
  const { loading, error, data } = useQuery<{ findAllOnlineBaazars: Baazar[] }>(
    GET_ONLINE_BAAZARS,
  );

  const [selectedBusiness, setSelectedBusiness] = useState<Baazar | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onlineBusinesses = useMemo(() => {
    const dataItems = data?.findAllOnlineBaazars || [];

    return dataItems.filter((b) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(query) ||
          (b.description || "").toLowerCase().includes(query) ||
          b.itemsType.some((item) =>
            getItemTypeSearchValue(item).includes(query),
          )
        );
      }

      return true;
    });
  }, [data, searchQuery]);

  const handleBusinessClick = (business: Baazar) => {
    setSelectedBusiness(business);
    setDetailOpen(true);
  };

  return (
    <div>
      <section className="bg-transparent pt-8 pb-4 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Bazares e Brechós <span className="text-primary">Online</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Compre de qualquer lugar do Brasil! Encontre os melhores brechós e
            bazares que vendem online.
          </p>
        </div>

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
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        {error ? (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Erro ao carregar lojas online
            </h2>
            <p className="text-muted-foreground">
              Não foi possível buscar os dados.
            </p>
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">Carregando lojas...</h2>
          </div>
        ) : onlineBusinesses.length === 0 ? (
          <div className="text-center py-16">
            <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Nenhum resultado encontrado
            </h2>
            <p className="text-muted-foreground">
              Tente ajustar sua busca para encontrar mais opções.
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
                    itemsType: business.itemsType || [],
                    description: business.description || "",
                  }}
                  onClick={() => handleBusinessClick(business)}
                />
              ))}
            </div>
          </>
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

