import { IMapBookEntity } from "../../../entities/types/IBookMapEnitity";
import { IPopulatedBookModel } from "../../../entities/types/IBookMapModel";

export class Mapper {
  static toBookEntity(bookDoc: IPopulatedBookModel): IMapBookEntity {
    return {
      _id: bookDoc._id.toString(),
      name: bookDoc.name,

      categoryId: {
        _id: bookDoc.categoryId._id.toString(),
        name:bookDoc.categoryId.name,
      },

      dealTypeId: {
        _id: bookDoc.dealTypeId._id.toString()
         ,
        name:bookDoc.dealTypeId.name,
      },
       ownerId: {
       _id:bookDoc.dealTypeId._id.toString(),
        Name:bookDoc.dealTypeId.name,
       },
      originalAmount: bookDoc.originalAmount,
      rentAmount: bookDoc.rentAmount,
      description: bookDoc.description,
      maxRentalPeriod: bookDoc.maxRentalPeriod,
      images: bookDoc.images,
      isActive: bookDoc.isActive,
      status: bookDoc.status,
      location: {
        type: bookDoc.location.type,
        coordinates: [...bookDoc.location.coordinates],
      },
      numberOfPages: bookDoc.numberOfPages,
      avgReadingTime: bookDoc.avgReadingTime,
      notifyUsers: bookDoc.notifyUsers,
      locationName: bookDoc.locationName,
      createdAt: bookDoc.createdAt,
      updatedAt: bookDoc.updatedAt,
    };
  }

  static toBookEntityList(docs: IPopulatedBookModel[]): IMapBookEntity[] {
    return docs.map(this.toBookEntity);
  }

  static toPaginatedBookEntityResponse(
    books: IPopulatedBookModel[],
    count: number,
    page: number,
    limit: number
  ) {
    const bookEntities = this.toBookEntityList(books);
    const totalPages = Math.ceil(count / limit);
    return {
      books: bookEntities,
      totalBooks: count,
      totalPages,
      currentPage: page,
    };
  }
}
