import { renewal_details } from "../../entities/models/rent_entity";

export interface RentDTO {
  _id: string;

  borrowerId: {
    _id: string;
    Name: string;
    email: string;
  };

  ownerId: {
    _id: string;
    Name: string;
    email: string;
  };

  bookId: {
    _id: string;
    name: string;
    images: string[];
  };

  rent_amount: number;
  original_amount: number;
  rent_start_date: Date;
  rent_end_date: Date;
  period_of_contract:number;
  status: string;
  renewal_status: string;
  return_requested_at: Date;
  returned_at: Date;
  penalty_amount: number;
  created_at: Date;
}
