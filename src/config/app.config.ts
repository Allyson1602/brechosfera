import type { BusinessCategory } from "@/types/business";

// Configuração central do app - fácil de customizar para outros projetos
export const appConfig = {
  // Informações gerais do app
  name: "Brechosfera",
  description: "Os melhores bazares e brechós perto de você",
  tagline: "Seu guia de achados únicos",

  // Configurações de localização padrão (Brasil)
  defaultLocation: {
    latitude: -15.7975,
    longitude: -47.8919,
    city: "Brasília",
    state: "DF",
  },

  // Raio de busca padrão em km
  defaultSearchRadius: 10,

  // Categorias disponíveis
  categories: {
    bazar: {
      label: "Bazar",
      icon: "ShoppingBag",
      color: "primary",
      description: "Bazares beneficentes e comerciais",
    },
    brecho: {
      label: "Brechó",
      icon: "Shirt",
      color: "accent",
      description: "Roupas e acessórios de segunda mão",
    },
    advogado: {
      label: "Advogado",
      icon: "Scale",
      color: "secondary",
      description: "Serviços jurídicos",
    },
    medico: {
      label: "Médico",
      icon: "Stethoscope",
      color: "chart-1",
      description: "Serviços de saúde",
    },
    oficina: {
      label: "Oficina",
      icon: "Wrench",
      color: "chart-2",
      description: "Reparos automotivos",
    },
    celular: {
      label: "Celular",
      icon: "Smartphone",
      color: "chart-3",
      description: "Manutenção de celulares",
    },
    outro: {
      label: "Outro",
      icon: "MoreHorizontal",
      color: "muted",
      description: "Outros serviços",
    },
  } as Record<
    BusinessCategory,
    { label: string; icon: string; color: string; description: string }
  >,

  // Categorias ativas nesta instância do app
  activeCategories: ["bazar", "brecho"] as BusinessCategory[],

  // Tipos de itens para bazares/brechós
  itemTypes: [
    "Roupas Femininas",
    "Roupas Masculinas",
    "Roupas Infantis",
    "Calçados",
    "Bolsas",
    "Acessórios",
    "Bijuterias",
    "Joias",
    "Decoração",
    "Móveis",
    "Eletrônicos",
    "Livros",
    "Brinquedos",
    "Artigos para Casa",
    "Vintage",
    "Artesanato",
  ],

  // Estados brasileiros
  states: [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ],
};

export type AppConfig = typeof appConfig;
