import { ISalePopulated } from "../../../entities/types/ISaleMapPopulated";
import { SingleSaleDTO } from "../../dto/singleSaleDto";

export const SingleSaleMapper = (sale: ISalePopulated): SingleSaleDTO => {
  return {
    _id: sale._id.toString(),
    price: sale.price,
    sale_date: sale.sale_date,

    bookId: {
      _id: sale.bookId._id.toString(),
      name: sale.bookId.name,
      categoryId: sale.bookId.categoryId.toString(),
      dealTypeId: sale.bookId.dealTypeId.toString(),
      originalAmount: sale.bookId.originalAmount,
      rentAmount: sale.bookId.rentAmount,
      description: sale.bookId.description,
      maxRentalPeriod: sale.bookId.maxRentalPeriod,
      images: sale.bookId.images,
      ownerId: sale.bookId.ownerId.toString(),
      isActive: sale.bookId.isActive,
      status: sale.bookId.status,
      location: sale.bookId.location,
      numberOfPages: sale.bookId.numberOfPages,
      avgReadingTime: sale.bookId.avgReadingTime,
      locationName: sale.bookId.locationName,
      createdAt: sale.bookId.createdAt,
    },

    buyerId: {
      _id: sale.buyerId._id.toString(),
      userId: sale.buyerId.userId,
      Name: sale.buyerId.Name,
      email: sale.buyerId.email,
      phoneNumber: sale.buyerId.phoneNumber,
      profileImage: sale.buyerId.profileImage,
      createdAt: sale.buyerId.createdAt,
    },

    ownerId: {
      _id: sale.ownerId._id.toString(),
      userId: sale.ownerId.userId,
      Name: sale.ownerId.Name,
      email: sale.ownerId.email,
      phoneNumber: sale.ownerId.phoneNumber,
      profileImage: sale.ownerId.profileImage,
      createdAt: sale.ownerId.createdAt,
    }
  };
};
