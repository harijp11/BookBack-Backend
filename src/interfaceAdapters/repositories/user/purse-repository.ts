import { injectable } from 'tsyringe';
import { IPurseRepository } from '../../../entities/repositoryInterface/user/purse_repository-interface';
import { IPurseModel,PurseModel } from '../../../frameworks/database/models/purse_model';

@injectable()
export class PurseRepository implements IPurseRepository {
  async findById(userId: string): Promise<IPurseModel | null> {
    return await PurseModel.findOne({ userId });
  }

  async create(userId: string): Promise<IPurseModel | null> {
    return await PurseModel.create({ userId, balance: 0, transactions: [] });
  }

  async addTransaction(
    userId: string,
    transaction: {
      type: 'credit' | 'debit';
      amount: number;
      status: 'pending' | 'completed' | 'failed';
      description?: string;
    }
  ): Promise<IPurseModel | null> {
    return await PurseModel.findOneAndUpdate(
      { userId },
      { $push: { transactions: transaction } },
      { new: true }
    );
  }

  async updateTransactionStatus(
    userId: string,
    tsId: string,
    status: 'pending' | 'completed' | 'failed'
  ): Promise<IPurseModel | null> {
    return await PurseModel.findOneAndUpdate(
      { userId, 'transactions.tsId': tsId },
      { $set: { 'transactions.$.status': status } },
      { new: true }
    );
  }

  async updateBalance(userId: string, amount: number): Promise<IPurseModel | null> {
    return await PurseModel.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { new: true }
    );
  }
}