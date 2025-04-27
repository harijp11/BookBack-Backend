export interface IContractRequestEntity {
    _id: string; 
    requesterId: string;
    ownerId:string
    bookId: string;
    request_type: 'borrow' | 'buy';
    status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
    created_at: Date;
    updated_at: Date;
  }
  