import { IPurseTransaction } from "./purse_transaction-entity";

export interface IPurseEntity {
    _id: string;                     
    userId: string;                  
    balance: number;                 
    transactions: IPurseTransaction[];
    createdAt: Date;                 
    updatedAt: Date;                 
  }