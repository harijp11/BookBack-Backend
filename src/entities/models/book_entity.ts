export interface IBookEntity {
    _id?: string;  
    name: string;
    categoryId: string;
    dealTypeId: string
    originalAmount: number;
    rentAmount: number;
    description: string;
    maxRentalPeriod: number; // in days
    images: string[];
    ownerId: string;
    isActive: boolean;
    status:string;
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
    locationName: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  