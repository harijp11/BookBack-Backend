export interface SingleSaleDTO {
  _id: string;
  price: number;
  sale_date: Date;

  bookId: {
    _id: string;
    name: string;
    categoryId: string;
    dealTypeId: string;
    originalAmount: number;
    rentAmount: number;
    description: string;
    maxRentalPeriod: number;
    images: string[];
    ownerId: string;
    isActive: boolean;
    status: string;
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
    numberOfPages: number;
    avgReadingTime: string;
    locationName: string;
    createdAt?: Date;
  };

  buyerId: {
    _id: string;
    userId: string;
    Name?: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
    createdAt: Date;
  };

  ownerId: {
    _id: string;
    userId: string;
    Name?: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
    createdAt: Date;
  };
}
