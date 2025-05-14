export interface IChatEntity {
    _id:string
    chatId?: string;
    userId1: string;
    userId2: string;
    last_message:string
    created_at?: Date;
    updated_at?: Date;
  }