import { JwtPayload } from "jsonwebtoken";
import { JWTPayloadData } from "../../interfaceAdapters/services/jwt_service";

export interface ITokenService {
	generateResetToken(email:string, role:string):string
	generateAccessToken(data:JWTPayloadData): string
	generateRefreshToken(data:JWTPayloadData): string
	verifyAccessToken(token: string): string | JwtPayload | null;
	verifyRefreshToken(token: string): string | JwtPayload | null;
	decodeAccessToken(token: string): JwtPayload | null;
	verifyResetToken(token: string): JwtPayload | null;
	decodeResetToken(token: string): JwtPayload | null;
}