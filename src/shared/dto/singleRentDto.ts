export interface SingleRentDTO {
  _id: string;

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

  borrowerId: {
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

  rent_amount: number;
  original_amount: number;
  rent_start_date: Date;
  rent_end_date: Date;
  period_of_contract: number;

  status:
    | 'Returned'
    | 'Return Requested'
    | 'On Rental'
    | 'Return Rejected'
    | 'Contract Date Exceeded'
    | 'Return Rejection Requested';

  renewal_status: 'No Renewal' | 'Renewal Requested' | 'Renewal Rejected' | 'Renewed';

  renewal_details: {
    days: number;
    amount: number;
    requested_at?: Date;
    response?: 'Pending' | 'Accepted' | 'Rejected';
    responded_at?: Date;
  }[];

  return_requested_at: Date;
  returned_at: Date;
  penalty_amount: number;
  created_at: Date;
}
