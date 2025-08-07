export interface IMapBookEntity {
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

  ownerId: {
    _id: string;
    Name: string;
  };
  originalAmount: number;
  rentAmount: number;
  description: string;
  maxRentalPeriod: number;
  images: string[];
  isActive: boolean;
  status: string;
  location: {
    type: string;
    coordinates: number[];
  };
  numberOfPages: number;
  avgReadingTime: string;
  notifyUsers: string[];
  locationName: string;
  createdAt?: Date;
  updatedAt?: Date;
}
