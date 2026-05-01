import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessDetail } from "@/components/business/BusinessDetail";
import { BusinessSearchField } from "@/components/business/BusinessSearchField";
import { PageBackgroundVectors } from "@/components/layout/PageBackgroundVectors";
import { Badge } from "@/components/ui/badge";
import { getItemTypeSearchValue } from "@/lib/business/itemTypeLabels";
import { Baazar } from "@/lib/graphql/generated";
import { GET_ONLINE_BAAZARS } from "@/lib/graphql/queries/business";
import { useQuery } from "@apollo/client/react";
import { AlertCircle, Globe, MessageCircle, Search, Sparkles } from "lucide-react";
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
      <Globe className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Nenhuma loja online encontrada</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {searchQuery
          ? "Tente buscar por tipo de peça, nome da loja ou palavras como bolsas, vestidos e acessórios."
          : "Ainda não encontramos lojinhas online publicadas. Volte em breve para ver novos achados."}
      </p>
    </div>
  );
}

export default function OnlinePage() {
  const { loading, error, data } = useQuery<{ findAllOnlineBaazars: Baazar[] }>(
    GET_ONLINE_BAAZARS,
  );

  const [selectedBusiness, setSelectedBusiness] = useState<Baazar | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onlineBusinesses = useMemo(() => {
    const dataItems = data?.findAllOnlineBaazars || [];
    const query = searchQuery.trim().toLowerCase();

    if (!query) return dataItems;

    return dataItems.filter((business) => {
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
    <div className="relative isolate overflow-hidden bg-transparent">
      <PageBackgroundVectors variant="online" />

      <section className="relative overflow-hidden px-4 py-10 md:py-14">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 rounded-full px-4 py-1.5" variant="secondary">
              <Sparkles className="mr-2 h-4 w-4 text-secondary" />
              Brechós online com informação prática
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              Compre de qualquer lugar com mais clareza sobre peças, preço e
              contato
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              Veja lojas que vendem online com foco no que ajuda a decidir
              rápido: faixa de preço, tipos de peças, avaliação, troca e canal
              de contato.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            <BusinessSearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por loja ou tipo de peça..."
              inputClassName="h-12 rounded-full bg-card/95 pl-11 shadow-sm"
            />
          </div>

          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm backdrop-blur">
              <MessageCircle className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Contato mais rápido</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Priorize lojas com canal direto para tirar dúvidas.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm backdrop-blur">
              <Sparkles className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Preço e variedade</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Compare faixas de valor e tipos de peças sem sair da tela.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm backdrop-blur">
              <Globe className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Compra remota</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ideal para quem quer praticidade e mais opções sem deslocamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Lojas online para garimpar</h2>
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Buscando lojinhas publicadas..."
                : `${onlineBusinesses.length} lojinha${onlineBusinesses.length !== 1 ? "s" : ""} encontrada${onlineBusinesses.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Mantivemos o mesmo critério da home: informação objetiva para uma
            escolha mais segura, prática e acessível.
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
        ) : onlineBusinesses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {onlineBusinesses.map((business) => (
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
