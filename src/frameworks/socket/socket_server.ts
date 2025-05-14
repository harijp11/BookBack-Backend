import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { injectable, inject } from 'tsyringe';
import { ISendMessageUseCase } from '../../entities/useCaseInterfaces/user/chat/send_message_usecase-interface';
import { IReceiveMessagesUseCase } from '../../entities/useCaseInterfaces/user/chat/receive_message_usecase-interface';
import { IFetchChatListUseCase } from '../../entities/useCaseInterfaces/user/chat/fetch_chat_list_usecase-interface';
import { ISocketServer } from '../../entities/socket/socket_server-interface';
import { config } from '../../shared/config';
import { NewChatEvent } from '../../entities/socket/socket_server-interface';

interface ConnectedUser {
  socketId: string;
}

@injectable()
export class SocketServer implements ISocketServer {
  private connectedUsers: Map<string, ConnectedUser> = new Map();
  private io!: Server;

  constructor(
    @inject('ISendMessageUseCase') private sendMessageUseCase: ISendMessageUseCase,
    @inject('IReceiveMessagesUseCase') private receiveMessagesUseCase: IReceiveMessagesUseCase,
    @inject('IFetchChatListUseCase') private fetchChatListUseCase: IFetchChatListUseCase
  ) {}

  initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.cors.ALLOWED_ORIGIN,
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id);

      socket.on('register', async ({ userId }: { userId: string }) => {
        this.connectedUsers.set(userId, { socketId: socket.id });
        socket.join(userId);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      });

      socket.on('getMessages', async ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        try {
          console.log('Received getMessages:', { senderId, receiverId });
          const messages = await this.receiveMessagesUseCase.execute({ senderId, receiverId });
          console.log('Fetched messages:', messages);
          socket.emit('messageHistory', { messages });
          console.log(`Sent messageHistory to ${senderId} for chat with ${receiverId}`);
        } catch (error) {
          console.error('Error fetching messages:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
            senderId,
            receiverId,
          });
          socket.emit('error', { message: 'Failed to fetch messages' });
        }
      });

      socket.on('sendMessage', async ({ senderId, receiverId, content, mediaUrl, messageType }: { senderId: string; receiverId: string; content?: string; mediaUrl?: string; messageType: 'text' | 'media' }) => {
        try {
          console.log('Received sendMessage:', { senderId, receiverId, content, mediaUrl, messageType });
          const { chatId, message, isNewChat } = await this.sendMessageUseCase.execute({
            senderId,
            receiverId,
            content,
            mediaUrl,
            messageType,
          });
          console.log('sendMessageUseCase result:', { chatId, message, isNewChat });

          this.io.to(receiverId).emit('receiveMessage', { chatId, message });
          console.log(`Emitted receiveMessage to receiver ${receiverId}`, { chatId, senderId: message.senderId, receiverId: message.receiverId });
          this.io.to(senderId).emit('receiveMessage', { chatId, message });
          console.log(`Emitted receiveMessage to sender ${senderId}`, { chatId, senderId: message.senderId, receiverId: message.receiverId });

          if (isNewChat) {
            const chats = await this.fetchChatListUseCase.execute(senderId);
            const newChat = chats.find((chat) => chat.chatId === chatId);
            if (newChat) {
              const chatEvent: NewChatEvent = {
                chat: {
                  chatId: newChat.chatId,
                  userId1: {
                    _id: (newChat.userId1 as any)._id.toString(),
                    Name: (newChat.userId1 as any).Name,
                    profileImage: (newChat.userId1 as any).profileImage,
                  },
                  userId2: {
                    _id: (newChat.userId2 as any)._id.toString(),
                    Name: (newChat.userId2 as any).Name,
                    profileImage: (newChat.userId2 as any).profileImage,
                  },
                  last_message: newChat.last_message || '',
                  created_at: newChat.created_at?.toISOString() ?? new Date().toISOString(),
                  updated_at: newChat.updated_at?.toISOString() ?? new Date().toISOString(),
                },
              };
              this.io.to(senderId).emit('newChat', chatEvent);
              this.io.to(receiverId).emit('newChat', chatEvent);
              console.log('Emitted newChat to:', { senderId, receiverId });
            }
          }
        } catch (error) {
          console.error('Error sending message:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
            senderId,
            receiverId,
            content,
            mediaUrl,
            messageType,
          });
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('messageSent', ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        console.log('Received messageSent:', { senderId, receiverId });
        this.io.to(senderId).emit('messageSent', { senderId, receiverId });
        this.io.to(receiverId).emit('messageSent', { senderId, receiverId });
        console.log('Emitted messageSent to:', { senderId, receiverId });
      });

      socket.on('disconnect', () => {
        for (const [userId, user] of this.connectedUsers) {
          if (user.socketId === socket.id) {
            this.connectedUsers.delete(userId);
            console.log(`User ${userId} disconnected`);
            break;
          }
        }
      });
    });
  }
}