export interface ISaleEntity {
    _id: string;
    buyerId: string;
    ownerId: string;
    bookId: string;
    price: number;
    sale_date: Date;
    created_at: Date;
    updated_at: Date;
  }