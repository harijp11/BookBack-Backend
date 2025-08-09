// src/entities/models/contract_request_populated.ts

import { Types } from "mongoose";

export interface IContractRequestPopulated {
  _id: Types.ObjectId;
  requesterId: {
    _id: string;
    Name: string;
    email: string;
  };
  ownerId: {
    _id: Types.ObjectId;
    Name: string;
  };
  bookId: {
    _id: Types.ObjectId;
    name: string;
  };
  request_type: 'borrow' | 'buy';
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: Date;
  updated_at: Date;
}
