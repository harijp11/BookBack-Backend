import { Server as HttpServer } from 'http';


export interface ISocketServer {
  initialize(httpServer: HttpServer): void;
}

export interface NewChatEvent {
  chat: {
    chatId: string;
    userId1: { _id: string; Name: string; profileImage?: string };
    userId2: { _id: string; Name: string; profileImage?: string };
    last_message?: string;
    last_message_type?: 'text' | 'media';
    updated_at: string;
    created_at: string;
  };
}

export interface ISocketServer {
    initialize(httpServer: HttpServer): void;
  }