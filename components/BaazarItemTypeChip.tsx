import { baazarItemType } from "../enums/baazarItemType";
import { Badge, BadgeText } from "./ui/badge";

interface IBaazarItemTypeChip {
  type: baazarItemType;
}

export const BaazarItemTypeChip = (props: IBaazarItemTypeChip) => {
  const { type } = props;

  const defineItemType = () => {
    switch (type) {
      case "MENSWEAR":
        return {
          text: "roupa masculina",
          color: "bg-blue-300",
        };
      case "WOMENSWEAR":
        return {
          text: "roupa feminina",
          color: "bg-pink-300",
        };
      case "CHILDRENSWEAR":
        return {
          text: "roupa infantil",
          color: "bg-orange-300",
        };
      case "SHOES":
        return {
          text: "sapatos",
          color: "bg-success-300",
        };
      case "JEWELRY":
        return {
          text: "joalheria",
          color: "bg-warning-300",
        };
      case "COSTUME_JEWELRY":
        return {
          text: "bijuterias",
          color: "bg-info-300",
        };
      case "TOYS":
        return {
          text: "brinquedos",
          color: "bg-red-300",
        };
      case "BAGS":
        return {
          text: "bolsas",
          color: "bg-amber-300",
        };
      case "ACCESSORIES":
        return {
          text: "acessórios",
          color: "bg-yellow-300",
        };
      case "FURNITURE":
        return {
          text: "móveis",
          color: "bg-lime-300",
        };
      case "PERSONAL_CARE":
        return {
          text: "cuidados pessoais",
          color: "bg-green-300",
        };
      case "MEDIA":
        return {
          text: "mídia",
          color: "bg-emerald-300",
        };
      case "BOOKS":
        return {
          text: "livros",
          color: "bg-teal-300",
        };
      case "ELECTRONICS":
        return {
          text: "eletrônicos",
          color: "bg-cyan-300",
        };
      case "TOOLS_AND_EQUIPMENT":
        return {
          text: "ferramentas e equipamentos",
          color: "bg-sky-300",
        };
      case "KITCHENWARE":
        return {
          text: "cozinha",
          color: "bg-indigo-300",
        };
      case "HOME_DECOR":
        return {
          text: "decoração de casa",
          color: "bg-violet-300",
        };
      case "KNICK_KNACKS":
        return {
          text: "bugigangas",
          color: "bg-purple-300",
        };
      default:
        return {
          text: "outros",
          color: "bg-gray-300",
        };
    }
  };

  return (
    <Badge
      size="md"
      variant="solid"
      className={`${defineItemType().color} rounded-full`}
    >
      <BadgeText className="text-white">{defineItemType().text}</BadgeText>
    </Badge>
  );
};
