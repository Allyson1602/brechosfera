import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessDetail } from "@/components/business/BusinessDetail";
import { BusinessSearchField } from "@/components/business/BusinessSearchField";
import { PageBackgroundVectors } from "@/components/layout/PageBackgroundVectors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateRating } from "@/helpers/calculateRating";
import {
  getItemTypeLabel,
  getItemTypeSearchValue,
} from "@/lib/business/itemTypeLabels";
import { Baazar, BaazarItemType } from "@/lib/graphql/generated";
import { GET_ONLINE_BAAZARS } from "@/lib/graphql/queries/business";
import { useQuery } from "@apollo/client/react";
import {
  AlertCircle,
  Globe,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type PriceFilter = "all" | "up-to-50" | "50-to-100" | "100-to-200" | "over-200";
type RatingFilter =
  | "all"
  | "rating-3"
  | "rating-3-5"
  | "rating-4"
  | "rating-4-5";
type StoreInfoFilter = "all" | "exchange" | "fast-contact" | "opening-hours";

function matchesPriceFilter(price: number, filter: PriceFilter) {
  if (filter === "all") return true;
  if (!price || price <= 0) return false;

  if (filter === "up-to-50") return price <= 50;
  if (filter === "50-to-100") return price > 50 && price <= 100;
  if (filter === "100-to-200") return price > 100 && price <= 200;

  return price > 200;
}

function matchesStoreInfoFilter(business: Baazar, filter: StoreInfoFilter) {
  if (filter === "all") return true;
  if (filter === "exchange") return business.isAcceptExchange;
  if (filter === "fast-contact") {
    return (
      business.linkWhatsapp?.some((item) => item.trim().length > 0) ||
      business.linkInstagram?.some((item) => item.trim().length > 0)
    );
  }

  return business.openingHours?.some((hour) => hour.trim().length > 0);
}

function getRatingFilterMinimum(filter: RatingFilter) {
  if (filter === "rating-3") return 3;
  if (filter === "rating-3-5") return 3.5;
  if (filter === "rating-4") return 4;
  if (filter === "rating-4-5") return 4.5;

  return null;
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
  const [selectedItemType, setSelectedItemType] = useState<
    BaazarItemType | "all"
  >("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [storeInfoFilter, setStoreInfoFilter] =
    useState<StoreInfoFilter>("all");

  const onlineBusinesses = useMemo(() => {
    const dataItems = data?.findAllOnlineBaazars || [];
    return dataItems.filter((business) => business.isOnline);
  }, [data]);

  const availableItemTypes = useMemo(() => {
    const itemTypes = new Set<BaazarItemType>();

    onlineBusinesses.forEach((business) => {
      business.itemsType.forEach((item) => itemTypes.add(item));
    });

    return Array.from(itemTypes).sort((a, b) =>
      getItemTypeLabel(a).localeCompare(getItemTypeLabel(b), "pt-BR"),
    );
  }, [onlineBusinesses]);

  const filteredBusinesses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return onlineBusinesses.filter((business) => {
      const rating = calculateRating(business.evaluations);
      const matchesSearch =
        !query ||
        business.name.toLowerCase().includes(query) ||
        (business.description || "").toLowerCase().includes(query) ||
        business.itemsType.some((item) =>
          getItemTypeSearchValue(item).includes(query),
        );
      const matchesItemType =
        selectedItemType === "all" ||
        business.itemsType.includes(selectedItemType);
      const ratingMinimum = getRatingFilterMinimum(ratingFilter);
      const matchesRating =
        ratingMinimum === null ||
        (rating.count > 0 && rating.rating >= ratingMinimum);

      return (
        matchesSearch &&
        matchesItemType &&
        matchesPriceFilter(business.averagePrice, priceFilter) &&
        matchesRating &&
        matchesStoreInfoFilter(business, storeInfoFilter)
      );
    });
  }, [
    onlineBusinesses,
    priceFilter,
    ratingFilter,
    searchQuery,
    selectedItemType,
    storeInfoFilter,
  ]);

  const activeFiltersCount = [
    searchQuery.trim(),
    selectedItemType !== "all",
    priceFilter !== "all",
    ratingFilter !== "all",
    storeInfoFilter !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedItemType("all");
    setPriceFilter("all");
    setRatingFilter("all");
    setStoreInfoFilter("all");
  };

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
            <Badge
              className="mb-4 rounded-full px-4 py-1.5"
              variant="secondary"
            >
              <Sparkles className="mr-2 h-4 w-4 text-secondary" />
              Brechós online com informação prática
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight">
              Compre de qualquer lugar com mais clareza sobre peças, preço e
              contato
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              Veja lojas que vendem online com foco no que ajuda a decidir
              rápido: faixa de preço, tipos de peças, avaliação, troca e canal
              de contato.
            </p>
          </div>

          <div className="hidden">
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
        <div className="mb-6">
          <div>
            <h2 className="text-2xl font-bold">Lojas para conhecer</h2>
            <p className="hidden">
              {loading
                ? "Buscando lojinhas publicadas..."
                : `${onlineBusinesses.length} lojinha${onlineBusinesses.length !== 1 ? "s" : ""} encontrada${onlineBusinesses.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <p className="hidden">
            Mantivemos o mesmo critério da home: informação objetiva para uma
            escolha mais segura, prática e acessível.
          </p>
        </div>

        <div className="mb-6 rounded-3xl border border-border/60 bg-card/85 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <BusinessSearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por loja ou tipo de peça..."
              inputClassName="h-11 rounded-full bg-background/90 pl-11"
            />

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Select
                value={selectedItemType}
                onValueChange={(value) =>
                  setSelectedItemType(value as BaazarItemType | "all")
                }
              >
                <SelectTrigger className="h-11 rounded-full bg-background/90 lg:w-44">
                  <SelectValue placeholder="Tipo de peça" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as peças</SelectItem>
                  {availableItemTypes.map((itemType) => (
                    <SelectItem key={itemType} value={itemType}>
                      {getItemTypeLabel(itemType)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={priceFilter}
                onValueChange={(value) => setPriceFilter(value as PriceFilter)}
              >
                <SelectTrigger className="h-11 rounded-full bg-background/90 lg:w-40">
                  <SelectValue placeholder="Preço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Qualquer preço</SelectItem>
                  <SelectItem value="up-to-50">Até R$ 50</SelectItem>
                  <SelectItem value="50-to-100">R$ 50 a R$ 100</SelectItem>
                  <SelectItem value="100-to-200">R$ 100 a R$ 200</SelectItem>
                  <SelectItem value="over-200">Acima de R$ 200</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={storeInfoFilter}
                onValueChange={(value) =>
                  setStoreInfoFilter(value as StoreInfoFilter)
                }
              >
                <SelectTrigger className="h-11 rounded-full bg-background/90 lg:w-44">
                  <SelectValue placeholder="Facilidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as lojas</SelectItem>
                  <SelectItem value="fast-contact">Contato rápido</SelectItem>
                  <SelectItem value="opening-hours">
                    Horário informado
                  </SelectItem>
                  <SelectItem value="exchange">Aceita troca</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={ratingFilter}
                onValueChange={(value) =>
                  setRatingFilter(value as RatingFilter)
                }
              >
                <SelectTrigger className="h-11 rounded-full bg-background/90 lg:w-44">
                  <SelectValue placeholder="Avaliação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Qualquer avaliação</SelectItem>
                  <SelectItem value="rating-4-5">4,5 ou mais</SelectItem>
                  <SelectItem value="rating-4">4,0 ou mais</SelectItem>
                  <SelectItem value="rating-3-5">3,5 ou mais</SelectItem>
                  <SelectItem value="rating-3">3,0 ou mais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>
                {activeFiltersCount > 0
                  ? `${activeFiltersCount} filtro${activeFiltersCount !== 1 ? "s" : ""} aplicado${activeFiltersCount !== 1 ? "s" : ""}`
                  : "Use os filtros para garimpar por estilo, preço e praticidade."}
              </span>
            </div>

            {activeFiltersCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="self-start rounded-full px-3 sm:self-auto"
              >
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-14 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">
              Não foi possível carregar as lojas
            </h2>
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

