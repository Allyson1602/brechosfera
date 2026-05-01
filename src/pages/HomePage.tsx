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
import { GET_LOCAL_BAAZARS } from "@/lib/graphql/queries/business";
import { useQuery } from "@apollo/client/react";
import {
  AlertCircle,
  HandHeart,
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
type StoreInfoFilter =
  | "all"
  | "address"
  | "exchange"
  | "fast-contact"
  | "opening-hours";

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
  if (filter === "address") return Boolean(business.address?.trim());
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
  const [selectedItemType, setSelectedItemType] = useState<
    BaazarItemType | "all"
  >("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [storeInfoFilter, setStoreInfoFilter] =
    useState<StoreInfoFilter>("all");

  const physicalBusinesses = useMemo(() => {
    const dataItems = data?.findAllLocalBaazars || [];
    return dataItems.filter((business) => !business.isOnline);
  }, [data]);

  const availableItemTypes = useMemo(() => {
    const itemTypes = new Set<BaazarItemType>();

    physicalBusinesses.forEach((business) => {
      business.itemsType.forEach((item) => itemTypes.add(item));
    });

    return Array.from(itemTypes).sort((a, b) =>
      getItemTypeLabel(a).localeCompare(getItemTypeLabel(b), "pt-BR"),
    );
  }, [physicalBusinesses]);

  const filteredBusinesses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return physicalBusinesses.filter((business) => {
      const rating = calculateRating(business.evaluations);
      const matchesSearch =
        !query ||
        business.name.toLowerCase().includes(query) ||
        (business.description || "").toLowerCase().includes(query) ||
        (business.address || "").toLowerCase().includes(query) ||
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
    physicalBusinesses,
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
      <PageBackgroundVectors variant="home" />

      <section className="relative overflow-hidden px-4 py-6 md:py-14">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              className="mb-4 rounded-full px-4 py-1.5"
              variant="secondary"
            >
              <Sparkles className="mr-2 h-4 w-4 text-secondary" />
              Garimpos reais, preços possíveis
            </Badge>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Encontre brechós acolhedores para renovar o guarda-roupa sem pesar
              no bolso
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:mt-4 md:text-lg">
              Veja lojas locais com preço médio, tipos de peças, endereço,
              horários e contato rápido para combinar sua visita com mais
              segurança.
            </p>
          </div>

          <div className="scrollbar-none -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-auto sm:mt-6 sm:grid sm:max-w-3xl sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
            <div className="w-64 flex-none rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm backdrop-blur sm:w-auto">
              <HandHeart className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Compra com calma</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Informações úteis antes de chamar ou visitar.
              </p>
            </div>
            <div className="w-64 flex-none rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm backdrop-blur sm:w-auto">
              <Sparkles className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Achados acessíveis</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Destaque para preço médio e variedade de peças.
              </p>
            </div>
            <div className="w-64 flex-none rounded-2xl border border-border/60 bg-card/80 p-4 text-left shadow-sm backdrop-blur sm:w-auto">
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
        <div className="mb-3 md:mb-6">
          <h2 className="text-2xl font-bold">Lojas para conhecer</h2>
        </div>

        <div className="mb-4 rounded-2xl border border-border/60 bg-card/85 p-3 shadow-sm backdrop-blur md:mb-6 md:rounded-3xl md:p-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <BusinessSearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por loja, bairro ou tipo de peça..."
              inputClassName="h-10 rounded-full bg-background/90 pl-11 md:h-11"
            />

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              <Select
                value={selectedItemType}
                onValueChange={(value) =>
                  setSelectedItemType(value as BaazarItemType | "all")
                }
              >
                <SelectTrigger className="h-10 rounded-full bg-background/90 text-xs md:h-11 md:text-sm lg:w-44">
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
                <SelectTrigger className="h-10 rounded-full bg-background/90 text-xs md:h-11 md:text-sm lg:w-40">
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
                <SelectTrigger className="h-10 rounded-full bg-background/90 text-xs md:h-11 md:text-sm lg:w-44">
                  <SelectValue placeholder="Facilidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as lojas</SelectItem>
                  <SelectItem value="address">Com endereço</SelectItem>
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
                <SelectTrigger className="h-10 rounded-full bg-background/90 text-xs md:h-11 md:text-sm lg:w-44">
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

          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between md:mt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground md:text-sm">
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

