export interface UserDTO {
  _id: string;
  userId: string;
  Name?: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
}
