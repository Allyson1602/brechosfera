export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

export interface Contact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
}

export interface OperatingHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: BusinessCategory;
  subcategory?: string;
  isOnline: boolean;
  rating: number;
  reviewCount: number;
  coverImage: string;
  images: string[];
  address?: string; // Address
  contact: Contact;
  operatingHours: OperatingHours[];
  itemTypes: string[];
  tags: string[];
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
  logoImage: string;
  locations?: {
    latitude: number;
    longitude: number;
  };
}

export type BusinessCategory =
  | "bazar"
  | "brecho"
  | "advogado"
  | "medico"
  | "oficina"
  | "celular"
  | "outro";

export interface BusinessFilterInput {
  category?: BusinessCategory;
  subcategory?: string;
  city?: string;
  state?: string;
  isOnline?: boolean;
  minRating?: number;
  tags?: string[];
  search?: string;
}

export interface CreateBusinessInput {
  name: string;
  description: string;
  category: BusinessCategory;
  subcategory?: string;
  isOnline: boolean;
  coverImage?: string;
  images?: string[];
  address?: Omit<Address, "latitude" | "longitude">;
  contact: Contact;
  operatingHours?: OperatingHours[];
  itemTypes?: string[];
  tags?: string[];
}
