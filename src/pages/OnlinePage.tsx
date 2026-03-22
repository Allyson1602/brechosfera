import { useMemo, useState } from "react";
import { AlertCircle, Globe } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessDetail } from "@/components/business/BusinessDetail";
import { BusinessSearchField } from "@/components/business/BusinessSearchField";
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

    return dataItems.filter((business) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();

      return (
        business.name.toLowerCase().includes(query) ||
        (business.description || "").toLowerCase().includes(query) ||
        business.itemsType.some((item) =>
          getItemTypeSearchValue(item).includes(query),
        )
      );
    });
  }, [data, searchQuery]);

  const handleBusinessClick = (business: Baazar) => {
    setSelectedBusiness(business);
    setDetailOpen(true);
  };

  return (
    <div>
      <section className="bg-transparent px-4 pb-4 pt-8">
        <div className="container mx-auto text-center">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            Bazares e Brechós <span className="text-primary">online</span>
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Compre de qualquer lugar do Brasil. Encontre os melhores brechós e
            bazares que vendem online.
          </p>
        </div>

        <div className="sticky z-40 pt-9">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <BusinessSearchField
                value={searchQuery}
                onChange={setSearchQuery}
                inputClassName="max-w-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        {error ? (
          <div className="py-16 text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
            <h2 className="mb-2 text-xl font-semibold">
              Erro ao carregar lojas online
            </h2>
            <p className="text-muted-foreground">
              Não foi possível buscar os dados.
            </p>
          </div>
        ) : loading ? (
          <div className="py-16 text-center">
            <h2 className="mb-2 text-xl font-semibold">Carregando lojas...</h2>
          </div>
        ) : onlineBusinesses.length === 0 ? (
          <div className="py-16 text-center">
            <Globe className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">
              Nenhum resultado encontrado
            </h2>
            <p className="text-muted-foreground">
              Tente ajustar sua busca para encontrar mais opções.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                {onlineBusinesses.length} lojinha
                {onlineBusinesses.length !== 1 ? "s" : ""}
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
