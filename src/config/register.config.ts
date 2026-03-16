import { DEFAULT_BAAZAR_IMAGE_URL } from "@/lib/graphql/client";

export const registerItemTypeValues = [
  "WOMENSWEAR",
  "MENSWEAR",
  "CHILDRENSWEAR",
  "SHOES",
  "BAGS",
  "ACCESSORIES",
  "COSTUME_JEWELRY",
  "JEWELRY",
  "HOME_DECOR",
  "FURNITURE",
  "ELECTRONICS",
  "BOOKS",
  "TOYS",
  "KITCHENWARE",
  "MEDIA",
  "PERSONAL_CARE",
  "TOOLS_AND_EQUIPMENT",
  "KNICK_KNACKS",
] as const;

export type RegisterItemTypeValue = (typeof registerItemTypeValues)[number];

export const registerConfig = {
  defaultLogoImage: DEFAULT_BAAZAR_IMAGE_URL,
  defaultOpeningHours: ["Seg-Sáb: 09:00-18:00"],
  defaultStoreSize: "MEDIUM" as const,
  defaultItemRenewal: "MONTHLY" as const,
  defaultAveragePrice: 0,
  defaultAverageQuantity: 0,
  defaultIsAcceptExchange: false,
  itemTypes: [
    { label: "Roupas Femininas", value: "WOMENSWEAR" },
    { label: "Roupas Masculinas", value: "MENSWEAR" },
    { label: "Roupas Infantis", value: "CHILDRENSWEAR" },
    { label: "Calçados", value: "SHOES" },
    { label: "Bolsas", value: "BAGS" },
    { label: "Acessórios", value: "ACCESSORIES" },
    { label: "Bijuterias", value: "COSTUME_JEWELRY" },
    { label: "Joias", value: "JEWELRY" },
    { label: "Decoração", value: "HOME_DECOR" },
    { label: "Móveis", value: "FURNITURE" },
    { label: "Eletrônicos", value: "ELECTRONICS" },
    { label: "Livros", value: "BOOKS" },
    { label: "Brinquedos", value: "TOYS" },
    { label: "Itens para Casa", value: "KITCHENWARE" },
    { label: "Mídia", value: "MEDIA" },
    { label: "Cuidados Pessoais", value: "PERSONAL_CARE" },
    { label: "Ferramentas e Equipamentos", value: "TOOLS_AND_EQUIPMENT" },
    { label: "Decorativos", value: "KNICK_KNACKS" },
  ] as const,
};
