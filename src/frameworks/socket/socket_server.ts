import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { injectable, inject } from 'tsyringe';
import { ISendMessageUseCase } from '../../entities/useCaseInterfaces/user/chat/send_message_usecase-interface';
import { IReceiveMessagesUseCase } from '../../entities/useCaseInterfaces/user/chat/receive_message_usecase-interface';
import { ISocketServer } from '../../entities/socket/socket_server-interface';
import { config } from '../../shared/config';



interface ConnectedUser {
  socketId: string;
}

@injectable()
export class SocketServer implements ISocketServer {
  private connectedUsers: Map<string, ConnectedUser> = new Map();
  private io!: Server;
  constructor(
    @inject('ISendMessageUseCase') private sendMessageUseCase: ISendMessageUseCase,
    @inject('IReceiveMessagesUseCase') private receiveMessagesUseCase: IReceiveMessagesUseCase

  ) {
  }

  initialize(httpServer: HttpServer): void {

    this.io = new Server(httpServer, {
      cors: {
        origin: config.cors.ALLOWED_ORIGIN, // or specify your frontend URL
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id);

      socket.on('register', async ({ userId }: { userId: string }) => {
        this.connectedUsers.set(userId, { socketId: socket.id });
        socket.join(userId);
        console.log(`User ${userId} registered`);
      });

      socket.on('getMessages', async ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        const messages = await this.receiveMessagesUseCase.execute({ senderId, receiverId });
        socket.emit('messageHistory', { messages });
      });

      socket.on('sendMessage', async ({ senderId, receiverId, content, mediaUrl, messageType }: { senderId: string; receiverId: string; content?: string; mediaUrl?: string; messageType: 'text' | 'media' }) => {
        const { chatId, message } = await this.sendMessageUseCase.execute({
          senderId,
          receiverId,
          content,
          mediaUrl,
          messageType,
        });

        const receiver = this.connectedUsers.get(receiverId);
        if (receiver) {
          this.io.to(receiver.socketId).emit('receiveMessage', { chatId, message });
        }
        socket.emit('receiveMessage', { chatId, message });
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