// src/application/dtos/book/single_book.dto.ts
export interface SingleBookDTO {
  _id: string;
  name: string;
  categoryId: {
    _id: string;
    name: string;
  };
  dealTypeId: {
    _id: string;
    name: string;
  };
  originalAmount: number;
  rentAmount: number;
  description: string;
  maxRentalPeriod: number;
  images: string[];
  ownerId: {
    _id: string;
    Name: string;
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
