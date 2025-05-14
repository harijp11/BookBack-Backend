export interface renewal_details {
    days: number;
    amount: number;
    requested_at?:Date
    response?:"Pending" | "Accepted" | "Rejected"
    responded_at?:Date
}
   
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
    status: 'Returned' | 'Return Requested' | 'On Rental' | 'Return Rejected' | 'Contract Date Exceeded' | "Return Rejection Requested";
    renewal_status: 'No Renewal' | 'Renewal Requested' | 'Renewal Rejected' | 'Renewed';
    renewal_details: renewal_details[]   
    return_requested_at: Date 
    returned_at:Date
    penalty_amount: number;
    created_at: Date;
    updated_at: Date;
  }
  