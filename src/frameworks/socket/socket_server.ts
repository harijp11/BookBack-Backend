import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { injectable, inject } from 'tsyringe';
import { ISendMessageUseCase } from '../../entities/useCaseInterfaces/user/chat/send_message_usecase-interface';
import { IReceiveMessagesUseCase } from '../../entities/useCaseInterfaces/user/chat/receive_message_usecase-interface';
import { IFetchChatListUseCase } from '../../entities/useCaseInterfaces/user/chat/fetch_chat_list_usecase-interface';
import { IGetMessageUseCase } from '../../entities/useCaseInterfaces/user/chat/get_message_usecase-interface';
import { ISocketServer } from '../../entities/socket/socket_server-interface';
import { config } from '../../shared/config';
import { NewChatEvent } from '../../entities/socket/socket_server-interface';
import { IUpdateMessageStatusUseCase } from '../../entities/useCaseInterfaces/user/chat/update_message_status_usecase-interface';

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
    @inject('IFetchChatListUseCase') private fetchChatListUseCase: IFetchChatListUseCase,
    @inject('IUpdateMessageStatusUseCase') private updateMessageStatusUseCase: IUpdateMessageStatusUseCase,
    @inject('IGetMessageUseCase') private getMessageUseCase: IGetMessageUseCase
  ) {}

  initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.cors.ALLOWED_ORIGIN,
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      socket.on('register', async ({ userId }: { userId: string }) => {
        console.log('User registered:', { userId, socketId: socket.id });
        this.connectedUsers.set(userId, { socketId: socket.id });
        socket.join(userId);
      });

      socket.on('getMessages', async ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        try {
          console.log('Fetching messages:', { senderId, receiverId });
          const messages = await this.receiveMessagesUseCase.execute({ senderId, receiverId });
          socket.emit('messageHistory', { messages });
        } catch (error) {
          console.error('Error fetching messages:', error);
          socket.emit('error', { message: 'Failed to fetch messages' });
        }
      });

      socket.on('sendMessage', async ({ senderId, receiverId, content, mediaUrl, messageType }: { senderId: string; receiverId: string; content?: string; mediaUrl?: string; messageType: 'text' | 'media' }) => {
        try {
          console.log('Sending message:', { senderId, receiverId, content, mediaUrl, messageType });
          const { chatId, message, isNewChat } = await this.sendMessageUseCase.execute({
            senderId,
            receiverId,
            content,
            mediaUrl,
            messageType,
          });

          // Check if receiver is connected to set 'delivered' status
          if (this.connectedUsers.has(receiverId)) {
            console.log('Receiver connected, setting delivered:', { messageId: message._id });
            await this.updateMessageStatusUseCase.execute(message._id, 'delivered');
            message.status = 'delivered';
            this.io.to(senderId).emit('messageStatusUpdated', { messageId: message._id, status: 'delivered' });
            this.io.to(receiverId).emit('messageStatusUpdated', { messageId: message._id, status: 'delivered' });
          }

          this.io.to(receiverId).emit('receiveMessage', { chatId, message });
          this.io.to(senderId).emit('receiveMessage', { chatId, message });

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
                    onlineStatus: (newChat.userId1 as any).onlineStatus,
                  },
                  userId2: {
                    _id: (newChat.userId2 as any)._id.toString(),
                    Name: (newChat.userId2 as any).Name,
                    profileImage: (newChat.userId2 as any).profileImage,
                    onlineStatus: (newChat.userId2 as any).onlineStatus,
                  },
                  last_message: newChat.last_message || '',
                  created_at: newChat.created_at?.toISOString() ?? new Date().toISOString(),
                  updated_at: newChat.updated_at?.toISOString() ?? new Date().toISOString(),
                },
              };
              this.io.to(senderId).emit('newChat', chatEvent);
              this.io.to(receiverId).emit('newChat', chatEvent);
            }
          }
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('messageSent', ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        console.log('Message sent event:', { senderId, receiverId });
        this.io.to(senderId).emit('messageSent', { senderId, receiverId });
        this.io.to(receiverId).emit('messageSent', { senderId, receiverId });
      });

      socket.on('updateMessageStatus', async ({ messageId, status }: { messageId: string; status: 'delivered' | 'read'; userId?: string }) => {
        try {
          console.log('Updating message status:', { messageId, status });
          await this.updateMessageStatusUseCase.execute(messageId, status);
          const message = await this.getMessageById(messageId);
          if (message) {
            console.log('Emitting messageStatusUpdated:', { messageId, status, senderId: message.senderId, receiverId: message.receiverId });
            this.io.to(message.senderId.toString()).emit('messageStatusUpdated', { messageId: message._id, status });
            this.io.to(message.receiverId.toString()).emit('messageStatusUpdated', { messageId: message._id, status });
          } else {
            console.error('Message not found after update:', { messageId });
          }
        } catch (error) {
          console.error('Error updating message status:', error);
          socket.emit('error', { message: 'Failed to update message status' });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', { socketId: socket.id });
        for (const [userId, user] of this.connectedUsers) {
          if (user.socketId === socket.id) {
            this.connectedUsers.delete(userId);
            break;
          }
        }
      });
    });
  }

  private async getMessageById(messageId: string) {
    return await this.getMessageUseCase.execute(messageId);
  }
}



