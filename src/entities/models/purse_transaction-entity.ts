export interface IPurseTransaction {
    tsId: string;                      
    type: 'credit' | 'debit';        
    amount: number;                
    status: 'pending' | 'completed' | 'failed';
    description?: string;            
    createdAt: Date;               
  }
  