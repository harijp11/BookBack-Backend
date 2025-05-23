import { injectable } from "tsyringe";
import { ITokenService } from "../../entities/serviceInterfaces/token_service-interface";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { config } from "../../shared/config";
import ms from "ms";
import { ObjectId } from "mongoose";

export interface JWTPayloadData extends JwtPayload {
  _id: ObjectId;
  id: string;
  email: string;
  role: string;
}
export interface ResetTokenPayload extends JWTPayloadData{
  email: string;
  role: string;
}

@injectable()
export class JWTService implements ITokenService {
  private accessSecret: Secret;
  private accessExpiresIn: string;
  private refreshSecret: Secret;
  private refreshExpiresIn: string;
  private resetSecret: Secret;
  private resetExpiresIn: string;

  constructor() {
    this.accessSecret = config.jwt.ACCESS_SECRET_KEY;
    this.accessExpiresIn = config.jwt.ACCESS_EXPIRES_IN;
    this.refreshSecret = config.jwt.REFRESH_SECRET_KEY;
    this.refreshExpiresIn = config.jwt.REFRESH_EXPIRES_IN;
    this.resetSecret = config.jwt.RESET_SECRET_KEY;
    this.resetExpiresIn = config.jwt.RESET_EXPIRES_IN;
  }

  generateAccessToken(payload:JWTPayloadData): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiresIn as ms.StringValue,
    });
  }

  generateRefreshToken(payload:JWTPayloadData): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn as ms.StringValue,
    });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.accessSecret) as JwtPayload;
    } catch (error) {
      console.error("Access token verification failed:", error);
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.refreshSecret) as JwtPayload;
    } catch (error) {
      console.error("Refresh token verification failed:", error);
      return null;
    }
  }

  decodeAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      console.error("Refresh token verification failed:", error);
      return null;
    }
  }

  verifyResetToken(token: string): JWTPayloadData | null {
    try {
      return jwt.verify(token, this.resetSecret) as JWTPayloadData;
    } catch (error) {
      console.error("Reset token verification failed:", error);
      return null;
    }
  }

  decodeResetToken(token: string): JWTPayloadData | null {
    try {
      return jwt.decode(token) as JWTPayloadData;
    } catch (error) {
      console.error("Reset token decoding failed", error);
      return null;
    }
  }

  generateResetToken(email: string, role: string): string {
    return jwt.sign({email, role}, this.resetSecret, {
      expiresIn: this.refreshExpiresIn as ms.StringValue,
    });
  }
}
