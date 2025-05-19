import {inject,injectable} from "tsyringe"
import { Request,Response } from "express"

import { IAuthController } from "../../../entities/controllersInterfaces/auth/auth_controller-interface"
import { IGoogleUseCase } from "../../../entities/useCaseInterfaces/auth/google_auth_usecase-interface"
import { IGenerateTokenUseCase } from "../../../entities/useCaseInterfaces/auth/generate_token_usecase-interface"
import { ILoginUserUseCase } from "../../../entities/useCaseInterfaces/auth/login_usecase-interface"
import { IBlackListTokenUseCase } from "../../../entities/useCaseInterfaces/auth/blacklist_token_usecase-interface"
import { IRevokeRefreshTokenUseCase } from "../../../entities/useCaseInterfaces/auth/revoke_refresh_token_usecase-interface"
import { IRefreshTokenUseCase } from "../../../entities/useCaseInterfaces/auth/refresh_token_usecase-interface"
import { IRegisterUserUseCase } from "../../../entities/useCaseInterfaces/auth/register_usecase-interface"
import { ISendOtpEmailUseCase } from "../../../entities/useCaseInterfaces/auth/send_otp_usecase-interface"
import { IVerifyOtpUseCase } from "../../../entities/useCaseInterfaces/auth/verify_otp_usecase-interface"
import { setAuthCookies,clearAuthCookies,updateCookieWithAccessToken } from "../../../shared/utils/cookie_helper"
import { SUCCESS_MESSAGES,HTTP_STATUS,ERROR_MESSAGES } from "../../../shared/constants"

import { LoginUserDTO,UserDTO } from "../../../shared/dto/userDto"
import { loginSchema } from "../AuthValidation/user_login_validation_schema"
import { userSchemas } from "../AuthValidation/user_signup_validation_schema"
import { otpMailValidationSchema } from "../AuthValidation/otp_mail_validation_schema"
import { CustomRequest } from "../../middlewares/auth_middleware"
import { handleErrorResponse } from "../../../shared/utils/errorHandler"
import { IForgotPasswordUseCase } from "../../../entities/useCaseInterfaces/auth/forgot_password_usecase-interface"
import { IResetPasswordUseCase } from "../../../entities/useCaseInterfaces/auth/reset_password_usecase-interface"
import { resetPasswordValidationSchema } from "../AuthValidation/reset_password_validation_schema"
import { ZodError } from "zod"
import { forgotPasswordValidationSchema } from "../AuthValidation/forgot_password_validation_schema"
import { IChangeOnlineStatusUseCase } from "../../../entities/useCaseInterfaces/user/chat/change_online_status_usecase-interface"


@injectable()
export class AuthController implements IAuthController{
    constructor(
        @inject("IGoogleUseCase")
        private _googleUseCase: IGoogleUseCase,
        @inject("IGenerateTokenUseCase")
        private _generateTokenUseCase: IGenerateTokenUseCase,
        @inject("ILoginUserUseCase")
        private _loginUserUseCase: ILoginUserUseCase,
        @inject("IBlackListTokenUseCase")
        private _blackListTokenUseCase: IBlackListTokenUseCase,
        @inject("IRevokeRefreshTokenUseCase")
        private _revokeRefreshToken: IRevokeRefreshTokenUseCase,
        @inject("IRefreshTokenUseCase")
        private _refreshTokenUseCase: IRefreshTokenUseCase,
        @inject("IRegisterUserUseCase")
        private _registerUserUseCase: IRegisterUserUseCase,
        @inject("ISendOtpEmailUseCase")
        private _sendOtpEmailUseCase: ISendOtpEmailUseCase,
        @inject("IVerifyOtpUseCase")
        private _verifyOtpUseCase: IVerifyOtpUseCase,
        @inject("IForgotPasswordUseCase")
        private _forgotPasswordUseCase: IForgotPasswordUseCase,
        @inject("IResetPasswordUseCase")
        private _resetPasswordUseCase: IResetPasswordUseCase,
        @inject("IChangeOnlineStatusUseCase")
        private _changeOnlineStatusUseCase:IChangeOnlineStatusUseCase
      ) {}

      async authenticateWithGoogle(req: Request, res: Response): Promise<void> {
          try{
            const {credential,client_id,role} = req.body

            const user = await this._googleUseCase.execute(
                credential,
                client_id,
                role
            );
            if (!user._id || !user.email || !user.role) {
                throw new Error("User ID, email, or role is missing");
              }

              const tokens = await this._generateTokenUseCase.execute(
                user._id,
                user.userId || "",
                user.email,
                user.role
              );
              await this._changeOnlineStatusUseCase.execute(user?._id.toString(),"online") 
              
              const accessTokenName = `${user.role}_access_token`;
              const refreshTokenName = `${user.role}_refresh_token`;

              setAuthCookies(
                res,
                tokens.accessToken, 
                tokens.refreshToken,
                accessTokenName,
                refreshTokenName
              )
              console.log(user)

              res.status(HTTP_STATUS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.LOGIN_SUCCESS,
                user:user
              })
          }catch(error){
            handleErrorResponse(res, error);
        }
      }

      async forgotPassword(req: Request, res: Response): Promise<void> {
          try {
            const validateData = forgotPasswordValidationSchema.parse(req.body);
            if(!validateData){
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success:false,
                    message:ERROR_MESSAGES.VALIDATION_ERROR,
                })
            }
            await this._forgotPasswordUseCase.execute(validateData)
            
            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.EMAIL_SENT_SUCCESSFULLY
            })
          }catch(error){
            handleErrorResponse(res, error);
          }
      }

        async login(req: Request, res: Response): Promise<void> {
          try {
            const data = req.body as LoginUserDTO;
             
            const validatedData = loginSchema.parse(data);
            // console.log("login dataa",validatedData)
            if (!validatedData) {
              res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: ERROR_MESSAGES.INVALID_CREDENTIALS,
              });
            }
            const user = await this._loginUserUseCase.execute(validatedData);
           
            if (!user._id || !user.email || !user.role) {
              throw new Error("User ID, email, or role is missing");
            }

            const tokens = await this._generateTokenUseCase.execute(
              user?._id,
              user.userId || "bookbackAdmin",
              user.email,
              user.role
            )
            
            const accessTokenName = `${user.role}_access_token`;
            const refreshTokenName = `${user.role}_refresh_token`;
      
            setAuthCookies(
              res,
              tokens.accessToken,
              tokens.refreshToken,
              accessTokenName,
              refreshTokenName
            );

            await this._changeOnlineStatusUseCase.execute(user?._id.toString(),"online")
            
            res.status(HTTP_STATUS.OK).json({
              success: true,
              message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
              user: {
                _id:user._id,
                id: user.userId,
                Name:user.Name,
                email: user.email,
                profileImage:user.profileImage,
                phoneNumber:user.phoneNumber,
                role: user.role,
              },
            });
          } catch (error) {
            handleErrorResponse(res, error);
          }
        }

        async logout(req: Request, res: Response): Promise<void> {
            try {
              const user = (req as CustomRequest).user;
              console.log("User data in logout:", {
                _id:user._id,
                id: user.id,
                role: user.role,
                access_token: user.access_token,
                refresh_token: user.refresh_token,
              }); 
                 console.log("usersss",user)
              if (!user.access_token || !user.refresh_token) {
                throw new Error("Missing access or refresh token");
              }
          
              await this._blackListTokenUseCase.execute(user.access_token);
              console.log("Access token blacklisted");
          
              await this._revokeRefreshToken.execute(user.refresh_token);
              console.log("Refresh token revoked");
              
              await this._changeOnlineStatusUseCase.execute(user?._id.toString(),"offline")
              const accessTokenName = `${user.role}_access_token`;
              const refreshTokenName = `${user.role}_refresh_token`;
              clearAuthCookies(res, accessTokenName, refreshTokenName);
              console.log("Cookies cleared");
          
              res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
              });
            } catch (error: unknown) {
              if (error instanceof Error) {
                console.error("Logout error:", {
                  name: error.name,
                  message: error.message,
                  stack: error.stack,
                  details: error instanceof ZodError ? error.errors : null,
                });
              } else {
                console.error("Logout error (non-Error type):", error);
              }
              handleErrorResponse(res, error);
            }
          }

          handleTokenRefresh(req: Request, res: Response): void {
            try {
              const refreshToken = (req as CustomRequest).user.refresh_token;
              const newTokens = this._refreshTokenUseCase.execute(refreshToken);
              const accessTokenName = `${newTokens.role}_access_token`;
              updateCookieWithAccessToken(res, newTokens.accessToken, accessTokenName);
              res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
              });
            } catch (error) {
              clearAuthCookies(
                res,
                `${(req as CustomRequest).user.role}_access_token`,
                `${(req as CustomRequest).user.role}_refresh_token`
              );
              res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: ERROR_MESSAGES.INVALID_TOKEN,
              });
            }
          }

          async register(req: Request, res: Response): Promise<void> {
            try {
              const { role } = req.body as UserDTO;
             
              const schema = userSchemas[role];
        
              if (!schema) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                  success: false,
                  message: ERROR_MESSAGES.INVALID_ROLE,
                });
                return;
              }
        
              const validatedData = schema.parse(req.body);
              
              await this._registerUserUseCase.execute(validatedData);
        
              res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
              });
            } catch (error) {
              handleErrorResponse(res, error);
            }
          }

          async resetPassword(req: Request, res: Response): Promise<void> {
            try {
              const validatedData = resetPasswordValidationSchema.parse(req.body);
              console.log("Validate Data",validatedData)
              if (!validatedData) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                  success: false,
                  message: ERROR_MESSAGES.VALIDATION_ERROR,
                });
              }
        
              await this._resetPasswordUseCase.execute(validatedData);
              
              res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
              });
            } catch (error) {
              handleErrorResponse(res, error);
            }
          }

          async sendOtpEmail(req: Request, res: Response): Promise<void> {
            try {
              const { email } = req.body;
              await this._sendOtpEmailUseCase.execute(email);
              res.status(HTTP_STATUS.OK).json({
                message: SUCCESS_MESSAGES.OTP_SEND_SUCCESS,
                success: true,
              });
            } catch (error) {
              handleErrorResponse(res, error);
            }
          }

          

          async verifyOtp(req: Request, res: Response): Promise<void> {
            try {
              const { email, otp } = req.body;
              const validatedData = otpMailValidationSchema.parse({ email, otp });
              await this._verifyOtpUseCase.execute(validatedData);
          console.log("verify",validatedData)
              res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
              });
            } catch (error) {
              handleErrorResponse(res, error);
            }
          }
        
        


      }
    