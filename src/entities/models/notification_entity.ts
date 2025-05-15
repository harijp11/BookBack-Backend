export interface INotificationEntity {
    _id?: string; 
    userId: string; 
    title: string; 
    message: string; 
    type: "warning" | "info" | "fault" | "good" | "normal"; 
    isRead: boolean; 
    navlink: string; 
    created_at: Date; 
    updated_at: Date; 
  }
  