// src/dtos/contract_request.dto.ts

export interface ContractRequestDTO {
  _id: string;
  requesterId: {
    _id: string;
    Name: string;
    email: string;
  };
  ownerId: {
    _id: string;
    Name: string;
  };
  bookId: {
    _id: string;
    name: string;
  };
  requestType: 'borrow' | 'buy';
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: Date;
}
