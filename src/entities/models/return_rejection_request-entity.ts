export interface IReturnRejectionRequestEntity {
    _id: string; 
    rentId: string;
    ownerId: string;
    borrowerId: string;
    reason: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt?: Date;
    updatedAt?: Date;
  }
  