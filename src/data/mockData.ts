import type { Business } from "@/types/business";
import type { Event } from "@/types/event";

export const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Brechó das Amigas",
    slug: "brecho-das-amigas",
    description:
      "Roupas femininas selecionadas com muito carinho. Peças únicas e exclusivas de marcas renomadas com preços acessíveis.",
    category: "brecho",
    isOnline: false,
    rating: 4.8,
    reviewCount: 127,
    coverImage:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800",
    images: [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800",
    ],
    address: {
      street: "CLS 305 Bloco A",
      number: "Loja 10",
      neighborhood: "Asa Sul",
      city: "Brasília",
      state: "DF",
      zipCode: "70352-510",
      latitude: -15.8095,
      longitude: -47.9054,
    },
    contact: {
      phone: "(11) 99999-1234",
      whatsapp: "5511999991234",
      instagram: "@brechodasamigas",
    },
    operatingHours: [
      { dayOfWeek: 1, openTime: "10:00", closeTime: "19:00", isClosed: false },
      { dayOfWeek: 2, openTime: "10:00", closeTime: "19:00", isClosed: false },
      { dayOfWeek: 3, openTime: "10:00", closeTime: "19:00", isClosed: false },
      { dayOfWeek: 4, openTime: "10:00", closeTime: "19:00", isClosed: false },
      { dayOfWeek: 5, openTime: "10:00", closeTime: "19:00", isClosed: false },
      { dayOfWeek: 6, openTime: "10:00", closeTime: "17:00", isClosed: false },
      { dayOfWeek: 0, openTime: "", closeTime: "", isClosed: true },
    ],
    itemTypes: ["Roupas Femininas", "Bolsas", "Acessórios", "Calçados"],
    tags: ["vintage", "marcas", "sustentável"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Bazar Solidário Esperança",
    slug: "bazar-solidario-esperanca",
    description:
      "Bazar beneficente com renda revertida para instituições de caridade. Encontre roupas, móveis, livros e muito mais!",
    category: "bazar",
    isOnline: false,
    rating: 4.9,
    reviewCount: 89,
    coverImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
    ],
    address: {
      street: "CLN 406 Bloco D",
      number: "Sala 200",
      neighborhood: "Asa Norte",
      city: "Brasília",
      state: "DF",
      zipCode: "70847-540",
      latitude: -15.7652,
      longitude: -47.8761,
    },
    contact: {
      phone: "(11) 3456-7890",
      email: "contato@bazaresperanca.org.br",
      instagram: "@bazaresperanca",
    },
    operatingHours: [
      { dayOfWeek: 1, openTime: "09:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 2, openTime: "09:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 3, openTime: "09:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 4, openTime: "09:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 5, openTime: "09:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 6, openTime: "09:00", closeTime: "14:00", isClosed: false },
      { dayOfWeek: 0, openTime: "", closeTime: "", isClosed: true },
    ],
    itemTypes: [
      "Roupas Femininas",
      "Roupas Masculinas",
      "Roupas Infantis",
      "Móveis",
      "Livros",
      "Decoração",
    ],
    tags: ["beneficente", "solidário", "família"],
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
  },
  {
    id: "3",
    name: "Garagem Fashion",
    slug: "garagem-fashion",
    description:
      "Brechó especializado em peças vintage e retrô. Encontre tesouros únicos dos anos 60, 70 e 80!",
    category: "brecho",
    isOnline: false,
    rating: 4.7,
    reviewCount: 65,
    coverImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
    address: {
      street: "SHIS QI 05",
      number: "Comércio Local",
      neighborhood: "Lago Sul",
      city: "Brasília",
      state: "DF",
      zipCode: "71615-180",
      latitude: -15.8335,
      longitude: -47.899,
    },
    contact: {
      whatsapp: "5511888887777",
      instagram: "@garagemfashion",
    },
    operatingHours: [
      { dayOfWeek: 1, openTime: "11:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: 2, openTime: "11:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: 3, openTime: "11:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: 4, openTime: "11:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: 5, openTime: "11:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: 6, openTime: "11:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 0, openTime: "14:00", closeTime: "18:00", isClosed: false },
    ],
    itemTypes: ["Roupas Femininas", "Vintage", "Acessórios", "Joias"],
    tags: ["vintage", "retrô", "exclusivo"],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "4",
    name: "Closet Compartilhado",
    slug: "closet-compartilhado",
    description:
      "Brechó online com curadoria especial. Enviamos para todo o Brasil! Peças de qualidade a preços incríveis.",
    category: "brecho",
    isOnline: true,
    rating: 4.6,
    reviewCount: 234,
    coverImage:
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800",
    images: [
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800",
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800",
    ],
    contact: {
      email: "contato@closetcompartilhado.com.br",
      whatsapp: "5511977776666",
      instagram: "@closetcompartilhado",
      website: "https://closetcompartilhado.com.br",
    },
    operatingHours: [],
    itemTypes: ["Roupas Femininas", "Bolsas", "Calçados", "Acessórios"],
    tags: ["online", "curadoria", "todo brasil"],
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
  },
  {
    id: "5",
    name: "Bazar Online da Lu",
    slug: "bazar-online-da-lu",
    description:
      "Bazar online com variedade incrível! Roupas, decoração, eletrônicos e muito mais. Tudo com preço de bazar!",
    category: "bazar",
    isOnline: true,
    rating: 4.4,
    reviewCount: 156,
    coverImage:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
    images: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
    ],
    contact: {
      whatsapp: "5511966665555",
      instagram: "@bazardalu",
    },
    operatingHours: [],
    itemTypes: [
      "Roupas Femininas",
      "Decoração",
      "Eletrônicos",
      "Artigos para Casa",
    ],
    tags: ["online", "variedade", "promoções"],
    createdAt: "2024-02-15",
    updatedAt: "2024-02-15",
  },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Mega Bazar de Inverno",
    description:
      "O maior bazar de inverno da cidade! Casacos, blusas, cachecóis e muito mais com até 70% de desconto.",
    businessId: "2",
    business: {
      id: "2",
      name: "Bazar Solidário Esperança",
      coverImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    },
    coverImage:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
    startDate: "2025-01-15T09:00:00",
    endDate: "2025-01-17T18:00:00",
    address: {
      street: "CLN 406 Bloco D",
      number: "Sala 200",
      neighborhood: "Asa Norte",
      city: "Brasília",
      state: "DF",
      zipCode: "70847-540",
      latitude: -15.7652,
      longitude: -47.8761,
    },
    isOnline: false,
    status: "upcoming",
    isPublished: true,
    tags: ["inverno", "promoção", "casacos"],
    createdAt: "2024-12-01",
  },
  {
    id: "2",
    title: "Live de Achados Vintage",
    description:
      "Live especial com peças vintage raras! Entre ao vivo e garanta as melhores peças.",
    businessId: "3",
    business: {
      id: "3",
      name: "Garagem Fashion",
      coverImage:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    },
    coverImage:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800",
    startDate: "2024-12-31T19:00:00",
    endDate: "2024-12-31T22:00:00",
    isOnline: true,
    onlineUrl: "https://instagram.com/garagemfashion/live",
    status: "ongoing",
    isPublished: true,
    tags: ["live", "vintage", "online"],
    createdAt: "2024-12-20",
  },
  {
    id: "3",
    title: "Bazar de Natal Solidário",
    description:
      "Bazar especial de natal com renda revertida para famílias carentes. Venha fazer parte dessa corrente do bem!",
    businessId: "2",
    business: {
      id: "2",
      name: "Bazar Solidário Esperança",
      coverImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    },
    coverImage:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800",
    startDate: "2024-12-20T09:00:00",
    endDate: "2024-12-23T18:00:00",
    address: {
      street: "CLN 406 Bloco D",
      number: "Sala 200",
      neighborhood: "Asa Norte",
      city: "Brasília",
      state: "DF",
      zipCode: "70847-540",
      latitude: -15.7652,
      longitude: -47.8761,
    },
    isOnline: false,
    status: "past",
    isPublished: true,
    tags: ["natal", "solidário", "beneficente"],
    createdAt: "2024-12-01",
  },
];


