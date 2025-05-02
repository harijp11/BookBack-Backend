import { IPurseModel } from '../../../frameworks/database/models/purse_model';

export interface IPurseRepository {
  findById(userId: string): Promise<IPurseModel | null>;
  create(userId: string): Promise<IPurseModel | null>;
  addTransaction(userId: string, transaction: {
    tsId:string
    type: 'credit' | 'debit';
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    description?: string;
  }): Promise<IPurseModel | null>;
  updateTransactionStatus(userId: string, tsId: string, status: 'pending' | 'completed' | 'failed'): Promise<IPurseModel | null>;
  updateBalance(userId: string, amount: number): Promise<IPurseModel | null>;
  AddHoldAmount(userId:string,hold_amount:number):Promise<void>
}