import type { Address, Business } from "./business";

export type EventStatus = "upcoming" | "ongoing" | "past";

export interface Event {
  id: string;
  title: string;
  description: string;
  businessId?: string;
  business?: Pick<Business, "id" | "name" | "coverImage"> & {
    contact?: Business["contact"];
  };
  coverImage: string;
  images?: string[];
  startDate: string;
  endDate: string;
  address?: Address;
  status: EventStatus;
  isPublished: boolean;
  tags: string[];
  createdAt: string;
}

export interface EventFilterInput {
  status?: EventStatus;
  businessId?: string;
  city?: string;
  state?: string;
  startDateFrom?: string;
  startDateTo?: string;
  search?: string;
}
