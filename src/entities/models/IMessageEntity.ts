export interface IMessageEntity {
    _id:string
    messageId: string;
    chatId: string;
    senderId: string;
    receiverId: string;
    messageType: "text" | "media";
    content: string | null;
    mediaUrl?: string;
    status: "sent" | "delivered" | "read";
    created_at:Date
    updated_at:Date
  }