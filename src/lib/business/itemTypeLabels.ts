import { BaazarItemType } from "@/lib/graphql/generated";

const ITEM_TYPE_LABELS: Record<BaazarItemType, string> = {
  [BaazarItemType.Accessories]: "acessórios",
  [BaazarItemType.Bags]: "bolsas",
  [BaazarItemType.Books]: "livros",
  [BaazarItemType.Childrenswear]: "roupa infantil",
  [BaazarItemType.CostumeJewelry]: "bijuterias",
  [BaazarItemType.Electronics]: "eletrônicos",
  [BaazarItemType.Furniture]: "móveis",
  [BaazarItemType.HomeDecor]: "decoração de casa",
  [BaazarItemType.Jewelry]: "joias",
  [BaazarItemType.Kitchenware]: "utensílios de cozinha",
  [BaazarItemType.KnickKnacks]: "objetos decorativos",
  [BaazarItemType.Media]: "mídia",
  [BaazarItemType.Menswear]: "roupa para homem",
  [BaazarItemType.PersonalCare]: "cuidados pessoais",
  [BaazarItemType.Shoes]: "sapatos",
  [BaazarItemType.ToolsAndEquipment]: "ferramentas e equipamentos",
  [BaazarItemType.Toys]: "brinquedos",
  [BaazarItemType.Womenswear]: "roupa para mulher",
};

export function getItemTypeLabel(itemType: BaazarItemType | string): string {
  return ITEM_TYPE_LABELS[itemType as BaazarItemType] ?? itemType;
}

export function getItemTypeSearchValue(itemType: BaazarItemType | string): string {
  return `${itemType} ${getItemTypeLabel(itemType)}`.toLowerCase();
}
