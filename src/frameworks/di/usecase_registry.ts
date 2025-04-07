import { container } from "tsyringe";

import { IBcrypt } from "../security/bcrypt_interface";
import { PasswordBcrypt } from "../security/password_bcrypt";
import { OtpBcrypt } from "../security/otp_bcryptInterface";

import { IRegisterStrategy } from "../../useCases/auth/register_stratergies/register_startegy_interface";
import { UserRegisterStrategy } from "../../useCases/auth/register_stratergies/user_register_stratergy";
import { UserLoginStrategy } from "../../useCases/auth/login_startegies/user_login_startergy";
import { AdminLoginStrategy } from "../../useCases/auth/login_startegies/admin_login_startegy";

import { IUserRepository } from "../../entities/repositoryInterface/user/user_repository-interface";
import { UserRepository } from "../../interfaceAdapters/repositories/user/user-repository";
import { IOtpService } from "../../entities/serviceInterfaces/otp_service-interface";
import { OtpService } from "../../interfaceAdapters/services/otp_service";
import { IEmailService } from "../../entities/serviceInterfaces/email_service-interface";
import { EmailService } from "../../interfaceAdapters/services/email_service";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user_exist_service-interface";
import { UserExistenceService } from "../../interfaceAdapters/services/user_existence_service";
import { ITokenService } from "../../entities/serviceInterfaces/token_service-interface";
import { JWTService } from "../../interfaceAdapters/services/jwt_service";
import { ICloudinarySignatureService } from "../../entities/serviceInterfaces/cloudinary_service-interface";
import { CloudinarySignatureService } from "../../interfaceAdapters/services/cloudinary_service";

import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register_usecase-interface";
import { RegisterUserUseCase } from "../../useCases/auth/register_user_usecase";
import { ISendOtpEmailUseCase } from "../../entities/useCaseInterfaces/auth/send_otp_usecase-interface";
import { SendOtpEmailUseCase } from "../../useCases/auth/send_otp_mail_usecase";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/verify_otp_usecase-interface";
import { VerifyOtpUseCase } from "../../useCases/auth/verify_otp_usecase";
import { ILoginUserUseCase } from "../../entities/useCaseInterfaces/auth/login_usecase-interface";
import { LoginUserUseCase } from "../../useCases/auth/login_user_usecase";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/generate_token_usecase-interface";
import { GenerateTokenUseCase } from "../../useCases/auth/generate_token_usecase";
import { IBlackListTokenUseCase } from "../../entities/useCaseInterfaces/auth/blacklist_token_usecase-interface";
import { BlackListTokenUseCase } from "../../useCases/auth/blacklist_token_usecase";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/revoke_refresh_token_usecase-interface";
import { RevokeRefreshTokenUseCase } from "../../useCases/auth/revoke_refresh_token_usecase";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/refresh_token_usecase-interface";
import { RefreshTokenUseCase } from "../../useCases/auth/refresh_token_usecase";
import { GoogleUseCase } from "../../useCases/auth/google_auth_usecase";
import { IGoogleUseCase } from "../../entities/useCaseInterfaces/auth/google_auth_usecase-interface";

import { IGetAllUsersUseCase } from "../../entities/useCaseInterfaces/admin/user/get_all_users_usecase-interface";
import { GetAllUsersUseCase } from "../../useCases/admin/user/get_all_users-usecase";
import { UpdateUserStatusUseCase } from "../../useCases/admin/user/update_user_status-usecase";
import { IUpdateUserStatusUseCase } from "../../entities/useCaseInterfaces/admin/user/update_user_status_usecase-interface";


import { IForgotPasswordUseCase } from "../../entities/useCaseInterfaces/auth/forgot_password_usecase-interface";
import { ForgotPasswordUseCase } from "../../useCases/auth/forgot_password_usecase";
import { IResetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/reset_password_usecase-interface";
import { ResetPasswordUseCase } from "../../useCases/auth/reset_password_usecase";
import { IcreateNewCategoryUseCase } from "../../entities/useCaseInterfaces/admin/category/create_category_usecase-interface";
import { CreateNewCategoryUseCase } from "../../useCases/admin/category/create_category-usecase";
import { IGetAllPaginatedCategoryUseCase } from "../../entities/useCaseInterfaces/admin/category/get_all_paginated_categories_usecase-interface";
import { GetALLPaginatedCategories } from "../../useCases/admin/category/get_all_paginated_categories-usecase";
import { UpdateCategoryStatusUseCase } from "../../useCases/admin/category/update_category_status-usecase";
import { IUpdateCategoryUseCase } from "../../entities/useCaseInterfaces/admin/category/update_category_usecase-interface";
import { UpdateCategoryUseCase } from "../../useCases/admin/category/update_category_usecase";
import { ICreateDealTypeUseCase } from "../../entities/useCaseInterfaces/admin/dealType/create_deal_type_usecase-interface";
import { CreateDealTypeUseCase } from "../../useCases/admin/dealType/create_deal_type-usecase";
import { IGetAllPaginatedDealTypesUseCase } from "../../entities/useCaseInterfaces/admin/dealType/get_all_paginated_deal_type_usecase-interface";
import { GetAllPaginatedDealTypesUseCase } from "../../useCases/admin/dealType/get_all_paginated_deal_type-usecase";
import { IUpdateUserProfileUseCase } from "../../entities/useCaseInterfaces/user/update_user_profile_usecase-interface";
import { UpdateUserProfileUseCase } from "../../useCases/user/update_user_profile-usecase";


export class UseCaseRegistry {
  static registerUseCases(): void {
    //* ====== Register Bcrypts ====== *//
    container.register<IBcrypt>("IPasswordBcrypt", {
      useClass: PasswordBcrypt,
    });

    container.register<IBcrypt>("IOtpBcrypt", {
      useClass: OtpBcrypt,
    });

    //* ====== Register Services ====== *//
    container.register<IEmailService>("IEmailService", {
      useClass: EmailService,
    });

    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });

    container.register<IUserExistenceService>("IUserExistenceService", {
      useClass: UserExistenceService,
    });

    container.register<ITokenService>("ITokenService", {
      useClass: JWTService,
    });

    container.registerSingleton<IUserRepository>('IUserRepository',
     UserRepository)

     container.register<ICloudinarySignatureService>(
      "ICloudinarySignatureService",
      CloudinarySignatureService
    );

    //* ====== Register Strategies ====== *//
    container.register("UserRegisterStrategy", {
      useClass: UserRegisterStrategy,
    });

    container.register("UserLoginStrategy", {
      useClass: UserLoginStrategy,
    });


    container.register("AdminLoginStrategy", {
      useClass: AdminLoginStrategy,
    });

   

 

    //* ====== Register UseCases ====== *//
    container.register<IRegisterUserUseCase>("IRegisterUserUseCase", {
      useClass: RegisterUserUseCase,
    });

    container.register<ISendOtpEmailUseCase>("ISendOtpEmailUseCase", {
      useClass: SendOtpEmailUseCase,
    });

    container.register<IVerifyOtpUseCase>("IVerifyOtpUseCase", {
      useClass: VerifyOtpUseCase,
    });

    container.register<ILoginUserUseCase>("ILoginUserUseCase", {
      useClass: LoginUserUseCase,
    });

    container.register<IGenerateTokenUseCase>("IGenerateTokenUseCase", {
      useClass: GenerateTokenUseCase,
    });

    container.register<IBlackListTokenUseCase>("IBlackListTokenUseCase", {
      useClass: BlackListTokenUseCase,
    });

    container.register<IRevokeRefreshTokenUseCase>(
      "IRevokeRefreshTokenUseCase",
      {
        useClass: RevokeRefreshTokenUseCase,
      }
    );

    container.register<IRefreshTokenUseCase>("IRefreshTokenUseCase", {
      useClass: RefreshTokenUseCase,
    });

    container.register<IGetAllUsersUseCase>("IGetAllUsersUseCase", {
      useClass: GetAllUsersUseCase,
    });

    container.register<IUpdateUserStatusUseCase>("IUpdateUserStatusUseCase", {
      useClass: UpdateUserStatusUseCase,
    });

    container.register<IGoogleUseCase>("IGoogleUseCase", {
      useClass: GoogleUseCase,
    });

   

    container.register<IForgotPasswordUseCase>("IForgotPasswordUseCase", {
      useClass: ForgotPasswordUseCase,
    });

    container.register<IResetPasswordUseCase>("IResetPasswordUseCase", {
      useClass: ResetPasswordUseCase,
    });


    //category usecase register
    
    container.register<IcreateNewCategoryUseCase>("ICreateCategoryUseCase", {
      useClass: CreateNewCategoryUseCase,
    });

    container.register<IGetAllPaginatedCategoryUseCase>("IGetAllPaginatedCategoryUseCase",{
      useClass: GetALLPaginatedCategories
    })

    container.register<IUpdateUserStatusUseCase>("IUpdateCategoryStatus",{
      useClass:UpdateCategoryStatusUseCase
    })

    container.register<IUpdateCategoryUseCase>("IUpdateCategoryUseCase",{
      useClass:UpdateCategoryUseCase
    })


    //dealtype usecase register
     
    container.register<ICreateDealTypeUseCase>("ICreateDealTypeUseCase",{
      useClass:CreateDealTypeUseCase
    })

    container.register<IGetAllPaginatedDealTypesUseCase>("IGetAllDealTypesUseCase",{
      useClass:GetAllPaginatedDealTypesUseCase
    })


    //users usecase register

    container.register<IUpdateUserProfileUseCase>("IUpdateUserProfileUseCase",{
      useClass:UpdateUserProfileUseCase
    })
  }
}