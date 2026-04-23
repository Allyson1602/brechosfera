import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessDetail } from "@/components/business/BusinessDetail";
import { BusinessSearchField } from "@/components/business/BusinessSearchField";
import { Badge } from "@/components/ui/badge";
import { getItemTypeSearchValue } from "@/lib/business/itemTypeLabels";
import { Baazar } from "@/lib/graphql/generated";
import { GET_LOCAL_BAAZARS } from "@/lib/graphql/queries/business";
import { useQuery } from "@apollo/client/react";
import { AlertCircle, HandHeart, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

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

function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/70 px-6 py-14 text-center">
      <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Nenhuma lojinha encontrada</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {searchQuery
          ? "Tente buscar por bairro, nome da loja ou tipo de peça, como vestidos, bolsas ou sapatos."
          : "Ainda não encontramos lojas locais publicadas. Volte em breve para ver novos achados."}
      </p>
    </div>
  );
}

export default function HomePage() {
  const { loading, error, data } = useQuery<{ findAllLocalBaazars: Baazar[] }>(
    GET_LOCAL_BAAZARS,
  );

  const [selectedBusiness, setSelectedBusiness] = useState<Baazar | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const physicalBusinesses = useMemo(() => {
    const dataItems = data?.findAllLocalBaazars || [];
    return dataItems.filter((business) => !business.isOnline);
  }, [data]);

  const filteredBusinesses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return physicalBusinesses;

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

  return (
    <div className="bg-transparent">
      <section className="relative overflow-hidden px-4 py-10 md:py-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_32rem),linear-gradient(180deg,hsl(var(--accent)/0.8),transparent)]" />

        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 rounded-full px-4 py-1.5" variant="secondary">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              Garimpos reais, preços possíveis
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              Encontre brechós acolhedores para renovar o guarda-roupa sem
              pesar no bolso
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              Veja lojas locais com preço médio, tipos de peças, endereço,
              horários e contato rápido para combinar sua visita com mais
              segurança.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            <BusinessSearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por loja, bairro ou tipo de peça..."
              inputClassName="h-12 rounded-full bg-card/95 pl-11 shadow-sm"
            />
          </div>

          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm backdrop-blur">
              <HandHeart className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Compra com calma</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Informações úteis antes de chamar ou visitar.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm backdrop-blur">
              <Sparkles className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Achados acessíveis</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Destaque para preço médio e variedade de peças.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm backdrop-blur">
              <Search className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Busca simples</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Encontre por bairro, nome ou categoria.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-12">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Lojas para conhecer</h2>
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Buscando lojinhas publicadas..."
                : `${filteredBusinesses.length} lojinha${filteredBusinesses.length !== 1 ? "s" : ""} encontrada${filteredBusinesses.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Priorizamos detalhes que ajudam a decidir rápido: preço, peças,
            localização, horários e formas de contato.
          </p>
        </div>

        {error ? (
          <div className="rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-14 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">Não foi possível carregar as lojas</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente novamente em alguns instantes.
            </p>
          </div>
        ) : loading ? (
          <LoadingCards />
        ) : filteredBusinesses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onClick={() => handleBusinessClick(business)}
              />
            ))}
          </div>
        ) : (
          <EmptyState searchQuery={searchQuery} />
        )}
      </main>

      <BusinessDetail
        business={selectedBusiness}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
