// src/entities/mappers/single_rent.mapper.ts

import { IRentPopulated } from "../../../entities/types/IRentMapPopulated";
import { SingleRentDTO } from "../../dto/singleRentDto";

export class SingleRentDTOMapper {
  static toDTO(rent: IRentPopulated): SingleRentDTO {
    return {
      _id: rent._id.toString(),

      bookId: {
        _id: rent.bookId._id.toString(),
        name: rent.bookId.name,
        categoryId: rent.bookId.categoryId.toString(),
        dealTypeId: rent.bookId.dealTypeId.toString(),
        originalAmount: rent.bookId.originalAmount,
        rentAmount: rent.bookId.rentAmount,
        description: rent.bookId.description,
        maxRentalPeriod: rent.bookId.maxRentalPeriod,
        images: rent.bookId.images,
        ownerId: rent.bookId.ownerId.toString(),
        isActive: rent.bookId.isActive,
        status: rent.bookId.status,
        location: {
          type: rent.bookId.location.type,
          coordinates: rent.bookId.location.coordinates as [number, number],
        },
        numberOfPages: rent.bookId.numberOfPages,
        avgReadingTime: rent.bookId.avgReadingTime,
        locationName: rent.bookId.locationName,
        createdAt: rent.bookId.createdAt,
      },

      borrowerId: {
        _id: rent.borrowerId._id.toString(),
        userId: rent.borrowerId.userId,
        Name: rent.borrowerId.Name,
        email: rent.borrowerId.email,
        phoneNumber: rent.borrowerId.phoneNumber ?? undefined,
        profileImage: rent.borrowerId.profileImage ?? undefined,
        createdAt: rent.borrowerId.createdAt,
      },

      ownerId: {
         _id: rent.borrowerId._id.toString(),
        userId: rent.borrowerId.userId,
        Name: rent.borrowerId.Name,
        email: rent.borrowerId.email,
        phoneNumber: rent.borrowerId.phoneNumber ?? undefined,
        profileImage: rent.borrowerId.profileImage ?? undefined,
        createdAt: rent.borrowerId.createdAt,
      },

      rent_amount: rent.rent_amount,
      original_amount: rent.original_amount,
      rent_start_date: rent.rent_start_date,
      rent_end_date: rent.rent_end_date,
      period_of_contract: rent.period_of_contract,
      status: rent.status,
      renewal_status: rent.renewal_status,
      renewal_details: rent.renewal_details.map(detail => ({
        days: detail.days,
        amount: detail.amount,
        requested_at: detail.requested_at,
        response: detail.response,
        responded_at: detail.responded_at,
      })),
      return_requested_at: rent.return_requested_at,
      returned_at: rent.returned_at,
      penalty_amount: rent.penalty_amount,
      created_at: rent.created_at,
    };
  }
}
