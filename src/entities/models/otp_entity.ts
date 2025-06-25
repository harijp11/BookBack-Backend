import { ObjectId } from "mongoose";
import {  OtpPurpose } from "../../shared/constants";
export interface IOtpEntity {
    id?: string;
    otp: string;
    email: string;
    purpose:OtpPurpose
    expiresAt: Date;
    requesterId?:ObjectId
    bookId?:ObjectId
 }