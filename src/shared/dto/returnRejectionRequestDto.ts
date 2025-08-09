export interface ReturnRejectionRequestDTO {
  _id: string;
  rentId: {
    _id: string;
    bookId: {
      _id: string;
      name: string;
      originalAmount: number;
      rentAmount: number;
      images: string[];
      maxRentalPeriod: number;
      isActive: boolean;
      status: string;
      locationName: string;
      createdAt?: Date;
      updatedAt?: Date;
    };
    rent_amount: number;
    original_amount: number;
    rent_start_date: Date;
    rent_end_date: Date;
    period_of_contract: number;
    status: string;
    renewal_status: string;
    return_requested_at: Date;
    returned_at: Date;
    penalty_amount: number;
    renewal_details: any[];
    created_at: Date;
    updated_at: Date;
  };
   borrowerId: {
      _id: string;
      Name: string;
      email: string;
      phoneNumber: string;
      profileImage: string;
    };
    ownerId: {
      _id: string;
      Name: string;
      email: string;
      phoneNumber: string;
      profileImage: string;
    };
  reason: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date
}
