import { Server as HttpServer } from 'http';


export interface Message {
 _id:string
  messageId: string;
  chatId: string;
  senderId: { _id: string; Name: string; profileImage?: string };
  receiverId: { _id: string; Name: string; profileImage?: string };
  content: string;
  mediaUrl: string;
  messageType: 'text' | 'media';
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
  updated_at: string;
}

export interface Chat {
  chatId: string;
  userId1: { _id: string; Name: string; profileImage?: string ,onlineStatus :string};
  userId2: { _id: string; Name: string; profileImage?: string,onlineStatus :string };
  last_message: string;
  created_at: string;
  updated_at: string;
}

export interface NewChatEvent {
  chat: Chat;
}


export interface ISocketServer {
    initialize(httpServer: HttpServer): void;
  }