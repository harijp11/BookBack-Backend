import {  OtpPurpose } from "../../shared/constants";
export interface IOtpEntity {
    id?: string;
    otp: string;
    email: string;
    purpose:OtpPurpose
    expiresAt: Date;
 }