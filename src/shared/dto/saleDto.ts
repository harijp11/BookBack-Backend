
export interface SoldBookContractDTO {
  _id: string;
  buyerId: {
    _id: string;
    Name: string;
  };
  ownerId: {
    _id: string;
    Name: string;
  };
  bookId: {
    _id: string;
    name: string;
    images: string[];
  };
  price: number;
  sale_date: Date;
}
