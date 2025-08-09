// src/application/mappers/book.mapper.ts
import { IBookPopulated } from "../../../entities/types/ISinglePopulated";
import { SingleBookDTO } from "../../dto/singleBookDto";

export class BookMapper {
  static toSingleBookDTO(book: IBookPopulated): SingleBookDTO {
    return {
      _id: book._id.toString(),
      name: book.name,
      categoryId: {
        _id: book.categoryId._id.toString(),
        name: book.categoryId.name
      },
      dealTypeId: {
        _id: book.dealTypeId._id.toString(),
        name: book.dealTypeId.name
      },
      originalAmount: book.originalAmount,
      rentAmount: book.rentAmount,
      description: book.description,
      maxRentalPeriod: book.maxRentalPeriod,
      images: book.images,
      ownerId: {
        _id: book.ownerId._id.toString(),
        Name: book.ownerId.Name ?? "",
        profileImage: book.ownerId.profileImage
      },
      isActive: book.isActive,
      status: book.status,
      location: book.location,
      numberOfPages: book.numberOfPages,
      avgReadingTime: book.avgReadingTime,
      notifyUsers: book.notifyUsers,
      locationName: book.locationName,
      createdAt: book.createdAt
    };
  }
}
