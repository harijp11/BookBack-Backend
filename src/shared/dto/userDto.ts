import { TRole } from "../constants";


export interface AdminDTO {
  adminId?: string; 
  Name:string;
  email: string; 
  password: string; 
  role: "admin"; 
}


export interface ClientDTO {
  userId?: string; 
  Name:string;
  email: string; 
  phoneNumber: string; 
  password: string;
  role: "user"; 
  googleId?: string;
}


export type UserDTO = AdminDTO | ClientDTO 


export interface LoginUserDTO {
  email: string;
  password: string;
  role: TRole; 
}