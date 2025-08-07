import { IRentPopulated } from "../../../entities/types/IRentMapPopulated";
import { RentDTO } from "../../dto/IRentDto";

export const RentMapper = (rent: IRentPopulated): RentDTO => {
  return {
    _id: rent._id.toString(),
    borrowerId: {
      _id: rent.borrowerId._id.toString(),
      Name: rent.borrowerId.Name!,
      email: rent.borrowerId.email,
    },
    ownerId: {
      _id: rent.ownerId._id.toString(),
      Name: rent.ownerId.Name!,
      email: rent.ownerId.email,
    },
    bookId: {
      _id: rent.bookId._id.toString(),
      name: rent.bookId.name,
      images: rent.bookId.images,
    },
    rent_amount: rent.rent_amount,
    original_amount: rent.original_amount,
    rent_start_date: rent.rent_start_date,
    rent_end_date: rent.rent_end_date,
    period_of_contract:rent.period_of_contract,
    status: rent.status,
    renewal_status: rent.renewal_status,
    return_requested_at: rent.return_requested_at,
    returned_at: rent.returned_at,
    penalty_amount: rent.penalty_amount,
    created_at: rent.created_at,
  };
};
