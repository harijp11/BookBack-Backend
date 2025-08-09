// src/application/dtos/book/single_book.dto.ts
export interface SingleBookDTO {
  id: string;
  name: string;
  categoryId: {
    id: string;
    name: string;
  };
  dealTypeId: {
    id: string;
    name: string;
  };
  originalAmount: number;
  rentAmount: number;
  description: string;
  maxRentalPeriod: number;
  images: string[];
  ownerId: {
    id: string;
    name: string;
    profileImage?: string;
  };
  isActive: boolean;
  status: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  numberOfPages: number;
  avgReadingTime: string;
  notifyUsers: string[];
  locationName: string;
  createdAt?: Date;
}
