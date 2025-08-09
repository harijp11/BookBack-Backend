import { IReturnRejectionRequestPopulated } from "../../../entities/types/IReturnRejectionRequestPopulated";
import { ReturnRejectionRequestDTO } from "../../dto/returnRejectionRequestDto";

export class ReturnRejectionRequestMapper {
  static toDTO(data: IReturnRejectionRequestPopulated): ReturnRejectionRequestDTO {
    return {
      _id: data._id.toString(),
      rentId: {
        _id: data.rentId._id.toString(),
        bookId: {
          _id: data.rentId.bookId._id.toString(),
          name: data.rentId.bookId.name,
          originalAmount: data.rentId.bookId.originalAmount,
          rentAmount: data.rentId.bookId.rentAmount,
          images: data.rentId.bookId.images,
          maxRentalPeriod: data.rentId.bookId.maxRentalPeriod,
          isActive: data.rentId.bookId.isActive,
          status: data.rentId.bookId.status,
          locationName: data.rentId.bookId.locationName,
          createdAt: data.rentId.bookId.createdAt,
          updatedAt: data.rentId.bookId.updatedAt,
        },
        rent_amount: data.rentId.rent_amount,
        original_amount: data.rentId.original_amount,
        rent_start_date: data.rentId.rent_start_date,
        rent_end_date: data.rentId.rent_end_date,
        period_of_contract: data.rentId.period_of_contract,
        status: data.rentId.status,
        renewal_status: data.rentId.renewal_status,
        return_requested_at: data.rentId.return_requested_at,
        returned_at: data.rentId.returned_at,
        penalty_amount: data.rentId.penalty_amount,
        renewal_details: data.rentId.renewal_details,
        created_at: data.rentId.created_at,
        updated_at: data.rentId.updated_at
      },
      borrowerId: {
        _id: data.borrowerId._id.toString(),
        Name: data.borrowerId.Name || "",
        email: data.borrowerId.email,
        phoneNumber: data.borrowerId.phoneNumber || "",
        profileImage: data.borrowerId.profileImage || ""
      },
      ownerId: {
        _id: data.ownerId._id.toString(),
        Name: data.ownerId.Name || "",
        email: data.ownerId.email,
        phoneNumber: data.ownerId.phoneNumber || "",
        profileImage: data.ownerId.profileImage || ""
      },
      reason: data.reason,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }
}
