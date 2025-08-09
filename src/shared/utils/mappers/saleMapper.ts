// src/entities/mappers/sold_book_contract.mapper.ts

import { ISalePopulated } from "../../../entities/types/ISaleMapPopulated";
import { SoldBookContractDTO } from "../../dto/saleDto";

export class SoldBookContractMapper {
  static toDTO(sale: ISalePopulated): SoldBookContractDTO {
    return {
      _id: sale._id.toString(),
      buyerId: {
        _id: sale.buyerId._id.toString(),
        Name: sale.buyerId.Name || "",
      },
      ownerId: {
        _id: sale.ownerId._id.toString(),
        Name: sale.ownerId.Name || "",
      },
      bookId: {
        _id: sale.bookId._id.toString(),
        name: sale.bookId.name,
        images: sale.bookId.images,
      },
      price: sale.price,
      sale_date: sale.sale_date,
    };
  }
}
