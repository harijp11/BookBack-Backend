export interface IRentEntity {
    _id: string;
    borrowerId: string; 
    ownerId: string;      
    bookId: string;       
    rent_amount: number;  
    original_amount:number 
    rent_start_date: Date; 
    rent_end_date: Date;
    period_of_contract: number;
    status: 'Returned' | 'Return Requested' | 'On Rental' | 'Return Rejected' | 'Contract Date Exceeded';
    renewal_status: 'No Renewal' | 'Renewal Requested' | 'Renewal Rejected' | 'Renewed';
    renewal_details: {
      days: number;
      amount: number;
    } | null;  
    requested_at: Date 
    penalty_amount: number;
    created_at: Date;
    updated_at: Date;
  }
  