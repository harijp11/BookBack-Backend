import { container } from "tsyringe";

import { IBcrypt } from "../security/bcrypt_interface";
import { PasswordBcrypt } from "../security/password_bcrypt";
import { OtpBcrypt } from "../security/otp_bcryptInterface";

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
import { IUpdateUserProfileUseCase } from "../../entities/useCaseInterfaces/user/profile/update_user_profile_usecase-interface";
import { UpdateUserProfileUseCase } from "../../useCases/user/profile/update_user_profile-usecase";
import { IChangePasswordUseCase } from "../../entities/useCaseInterfaces/user/profile/change_user_password_usecase-interface";
import { changePasswordUseCase } from "../../useCases/user/profile/change_user_password-usecase";
import { IUpdateDealTypeStatusUseCase } from "../../entities/useCaseInterfaces/admin/dealType/update_deal_type_status_usecase-interface";
import { updateDealTypeStatusUseCase } from "../../useCases/admin/dealType/update_deal_type_status-usecase";
import { IUpdateDealTypeUseCase } from "../../entities/useCaseInterfaces/admin/dealType/update_deal_type_usecase-interface";
import { UpdateDealTypeUseCase } from "../../useCases/admin/dealType/update_deal_type_usecase";
import { ICreateNewBookUseCase } from "../../entities/useCaseInterfaces/user/book/create_new_book_usecase-interface";
import { CreateNewBookUseCase } from "../../useCases/user/book/create_new_book-usecase";
import { IGetAllDealTypesUseCase } from "../../entities/useCaseInterfaces/user/dealtype/get_all_deal_tyoe_usecase.interface";
import { GetAllDealTypesUseCase } from "../../useCases/user/dealtype/get_all_deal_types-usecase";
import { IGetAllCategoriesUseCase } from "../../entities/useCaseInterfaces/user/category/get_all_categories_usecase-interface";
import { GetAllCategoriesUseCase } from "../../useCases/user/category/get_all_categories-usecase";
import { IGetAllPaginatedOwnerBookUseCase } from "../../entities/useCaseInterfaces/user/book/get_all_paginated_owner_books_usecase-interface";
import { GetAllPaginatedOwnerBooks } from "../../useCases/user/book/get_all_paginated_owner_books-usecase";
import { IUpdateBookDetailsUseCase } from "../../entities/useCaseInterfaces/user/book/update_book_details_usecase-interface";
import { UpdateBookDetailsUseCase} from "../../useCases/user/book/update_book_details-usecase";
import { IUpdateBookStatus } from "../../entities/useCaseInterfaces/user/book/update_book_status_usecase-interface";
import { UpdateBookStatusUseCase } from "../../useCases/user/book/update_book_status-usecase";
import { IGetAllAdminPaginatedBooksUseCase } from "../../entities/useCaseInterfaces/admin/book/get_all_paginated_books_usecase-interface";
import { GetAllPaginatedBooksUseCase } from "../../useCases/admin/book/get_all_admin_paginated_books-usecase";
import { IGetAllUserAvailableBooksUseCase } from "../../entities/useCaseInterfaces/user/book/get_all_user_available_books_usecase-interface";
import { GetAllUserAvailbleBooksUseCase } from "../../useCases/user/book/get_all_user_available_books-usecase";
import { IGetUserBookDetailsUseCase } from "../../entities/useCaseInterfaces/user/book/get_book_details_usecase-interface";
import { GetUserBookDetailsUseCase } from "../../useCases/user/book/get_book_details-usecase";
import { IRelatedBooksUseCase } from "../../entities/useCaseInterfaces/user/book/get_related_book_usecase-interface";
import { GetRelatedBooksUseCase } from "../../useCases/user/book/get_related_books-usecase";
import { ICreateNewContractRequestUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/create_new_contract_request_usecase-interface";
import { CreateNewContractRequest } from "../../useCases/user/contractrequest/create_new_contract_request-usecase";
import { ICheckBookRequestExistUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/check_book_request_exist_usecase-interface";
import { CheckBookRequestExist } from "../../useCases/user/contractrequest/check_book_request_exist-usecase";
import { IFetchAllOwnerRequestsUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/fetch_all_owner_contract_requests_usecase-entity";
import { FetchAllOwnerContractRequestsUseCase } from "../../useCases/user/contractrequest/fetch_all_owner_contract_requests-usecase";
import { IContractRequestStatusUpdateUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/contract_request_update_status_usecase-interface";
import { ContractRequestUpdateStatus } from "../../useCases/user/contractrequest/contract_request_status_update-usecase";
import { IFetchPurseDetailsUseCase } from "../../entities/useCaseInterfaces/user/purse/fetch_purse_details_usecase-interface";
import { FetchPurseDetailsUseCase } from "../../useCases/user/purse/fetch_purse_details-usecase";
import { IStripeService } from "../../entities/serviceInterfaces/stripe_service-interface";
import { StripeService } from "../../interfaceAdapters/services/stripe_service";
import { IFundPurseUseCase } from "../../entities/useCaseInterfaces/user/purse/fund_usecase-interface";
import { FundPurseUseCase } from "../../useCases/user/purse/fund-usecase";
import { IStripeClient } from "../../entities/drivers/stripe_client-entity";
import { StripeClient } from "../drivers/stripeclient/stripe_client";
import { IFetchRequesterRequestsUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/fetch_requester_requests_usecase-entity";
import { FetchRequesterRequestsUseCase } from "../../useCases/user/contractrequest/fetch_requester_requests-usecase";
import { Container } from "winston";
import { ICancelContractRequestUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/cancel_contract_request_usecase-interface";
import { CancelContractRequest } from "../../useCases/user/contractrequest/cancel_contract_request-usecase";
import { IFetchFixDealDetailsUseCase } from "../../entities/useCaseInterfaces/user/contractrequest/fetch_fix_deal_details_usecase-interface";
import { FetchFixDealDetailsUseCase } from "../../useCases/user/contractrequest/fetch_fix_deal_details-usecase";
import { ICreateNewContractUseCase } from "../../entities/useCaseInterfaces/user/rental/create_new_contract_usecase-interface";
import { CreateNewContractUseCase } from "../../useCases/user/contract/create_new_contract-usecase";
import { IFetchSoldBooksContractUseCase } from "../../entities/useCaseInterfaces/user/sales/fetch_sold_books_usecase-interface";
import { FetchSoldBooksContractUseCase } from "../../useCases/user/sales/fetch_sold_books-usecase";
import { IFetchBoughtBooksContractsUseCase } from "../../entities/useCaseInterfaces/user/sales/fetch_bought_books_usecase-interface";
import { FetchBoughtBooksContractUseCase } from "../../useCases/user/sales/fetch_bought_books-usecase";
import { IGetRentedOutBooksContractUseCase } from "../../entities/useCaseInterfaces/user/rental/get_rented_out_books_contracts_usecase-interface";
import { GetRentedOutBooksContractUseCase } from "../../useCases/user/rentals/get_rented_out_books_contracts-usecase";
import { IGetBorrowedOutBooksContractUseCase } from "../../entities/useCaseInterfaces/user/rental/get_borrowed_books_contract_usecase-interface";
import { GetBorrowedBooksContractUseCase } from "../../useCases/user/rentals/get_borrowed_books_contract-usecase";
import { IFetchAdminSoldBooksContractUseCase } from "../../entities/useCaseInterfaces/admin/sale/fetch_admin_sold_books_contract_usecase-interface";
import { FetchAdminSoldBooksContractUseCase } from "../../useCases/admin/sale/fetch_admin_sold_books_contract-usecase";
import { IGetAdminRentedOutBooksContractUseCase } from "../../entities/useCaseInterfaces/admin/rental/get_admin_rented_out_books_contract_usecase-interface";
import { GetAdminRentedOutBooksContractUseCase } from "../../useCases/admin/rental/get_admin_rented_out_books_contract-usecase";
import { IWebhookHandlingUseCase } from "../../entities/useCaseInterfaces/user/purse/web_hook_handling_usecase-interface";
import { WebHookHandlingUseCase } from "../../useCases/user/purse/web_hook_handling-usecase";
import { IGetRentedOutBookDetailsUseCase } from "../../entities/useCaseInterfaces/user/rental/get_rented_out_book_details_usecase-interface";
import { GetRentedOutBookDetailsUseCase } from "../../useCases/user/rentals/get_rented_out_book_details-usecase";
import { IFetchSoldBooksContractDetailsUseCase } from "../../entities/useCaseInterfaces/user/sales/fetch_sold_book_contract_details_usecase-interface";
import { FetchSoldBookContractDetailsUseCase } from "../../useCases/user/sales/fetch_sold_book_contract_details-usecase";

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

    container.registerSingleton<IUserRepository>(
      "IUserRepository",
      UserRepository
    );

    container.register<ICloudinarySignatureService>(
      "ICloudinarySignatureService",
      CloudinarySignatureService
    );

    container.register<IStripeService>("IStripeService",{
       useClass:StripeService
    })


    //* =======Register client ===*//

    container.register<IStripeClient>("IStripeClient",{
      useClass:StripeClient
    })

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

    container.register<IGetAllPaginatedCategoryUseCase>(
      "IGetAllPaginatedCategoryUseCase",
      {
        useClass: GetALLPaginatedCategories,
      }
    );

    container.register<IUpdateUserStatusUseCase>("IUpdateCategoryStatus", {
      useClass: UpdateCategoryStatusUseCase,
    });

    container.register<IUpdateCategoryUseCase>("IUpdateCategoryUseCase", {
      useClass: UpdateCategoryUseCase,
    });

    container.register<IGetAllCategoriesUseCase>("IGetAllCategoriesUseCase", {
      useClass: GetAllCategoriesUseCase,
    });

    //dealtype usecase register

    container.register<ICreateDealTypeUseCase>("ICreateDealTypeUseCase", {
      useClass: CreateDealTypeUseCase,
    });

    container.register<IGetAllPaginatedDealTypesUseCase>(
      "IGetAllPaginatedDealTypesUseCase",
      {
        useClass: GetAllPaginatedDealTypesUseCase,
      }
    );
    container.register<IGetAllDealTypesUseCase>("IGetAllDealTypesUseCase", {
      useClass: GetAllDealTypesUseCase,
    });

    //users usecase register

    container.register<IUpdateUserProfileUseCase>("IUpdateUserProfileUseCase", {
      useClass: UpdateUserProfileUseCase,
    });

    container.register<IChangePasswordUseCase>("IChangePasswordUseCase", {
      useClass: changePasswordUseCase,
    });

    container.register<IUpdateDealTypeStatusUseCase>(
      "IUpdateDealTypeStatusUseCase",
      {
        useClass: updateDealTypeStatusUseCase,
      }
    );

    container.register<IUpdateDealTypeUseCase>("IUpdateDealTypeUseCase", {
      useClass: UpdateDealTypeUseCase,
    });

    //books

    container.register<ICreateNewBookUseCase>("ICreateNewBookUseCase", {
      useClass: CreateNewBookUseCase,
    });

    container.register<IGetAllPaginatedOwnerBookUseCase>("IGetAllPaginatedOwnerBooksUseCase",{
      useClass:GetAllPaginatedOwnerBooks
    })

    container.register<IUpdateBookDetailsUseCase>("IUpdateBookDetailsUseCase",{
      useClass:UpdateBookDetailsUseCase
    })

    container.register<IUpdateBookStatus>("IUpdateBookStatusUseCase",{
      useClass:UpdateBookStatusUseCase
    })



    container.register<IGetAllAdminPaginatedBooksUseCase>("IGetAllPaginatedBooksUseCase",{
      useClass:GetAllPaginatedBooksUseCase
    })


    container.register<IGetAllUserAvailableBooksUseCase>("IGetAllUserAvailableBooks",{
      useClass:GetAllUserAvailbleBooksUseCase
    })

    container.register<IGetUserBookDetailsUseCase>("IGetUserBookDetailsUseCase",{
      useClass:GetUserBookDetailsUseCase
    })

    container.register<IRelatedBooksUseCase>("IRelatedBooksUseCase",{
      useClass:GetRelatedBooksUseCase
    })


    //contract request 

    container.register<ICreateNewContractRequestUseCase>("ICreateNewContractRequestUseCase",{
      useClass:CreateNewContractRequest
    })

    container.register<ICheckBookRequestExistUseCase>("ICheckBookRequestExistUseCase",{
      useClass:CheckBookRequestExist
    })

    container.register<IFetchAllOwnerRequestsUseCase>("IFetchAllOwnerRequestsUseCase",{
      useClass:FetchAllOwnerContractRequestsUseCase
    })

    container.register<IContractRequestStatusUpdateUseCase>("IContractRequestStatusUpdateUseCase",{
      useClass:ContractRequestUpdateStatus
    })

    container.register<IFetchRequesterRequestsUseCase>("IFetchRequesterRequestsUseCase",{
      useClass:FetchRequesterRequestsUseCase
    })

   container.register<ICancelContractRequestUseCase>("ICancelContractRequestUseCase",{
    useClass:CancelContractRequest
   })

   container.register<IFetchFixDealDetailsUseCase>("IFetchFixDealDetailsUseCase",{
    useClass:FetchFixDealDetailsUseCase
   })




   //contract

   container.register<ICreateNewContractUseCase>("ICreateNewContractUseCase",{
    useClass:CreateNewContractUseCase
   })

   //sale contract
   container.register<IFetchSoldBooksContractUseCase>("IFetchSoldBooksContractsUseCase",{
    useClass:FetchSoldBooksContractUseCase
   })


   container.register<IFetchBoughtBooksContractsUseCase>("IFetchBoughtBooksContractsUseCase",{
    useClass:FetchBoughtBooksContractUseCase
   })


   container.register<IFetchAdminSoldBooksContractUseCase>("IFetchAdminSoldBooksContractsUseCase",{
    useClass:FetchAdminSoldBooksContractUseCase
   })

   container.register<IFetchSoldBooksContractDetailsUseCase>("IFetchSoldBookDetailsUseCase",{
    useClass:FetchSoldBookContractDetailsUseCase
   })


   //rental contract

   container.register<IGetRentedOutBooksContractUseCase>("IGetRentedOutBooksContractsUseCase",{
    useClass:GetRentedOutBooksContractUseCase
   })

   container.register<IGetBorrowedOutBooksContractUseCase>("IGetBorrowedBooksContractsUseCase",{
    useClass:GetBorrowedBooksContractUseCase
   })

   container.register<IGetAdminRentedOutBooksContractUseCase>("IGetAdminRentedOutBooksContractsUseCase",{
    useClass:GetAdminRentedOutBooksContractUseCase
   })

   container.register<IGetRentedOutBookDetailsUseCase>("IGetRentedOutBookDetailsUseCase",{
       useClass:GetRentedOutBookDetailsUseCase
   })




    //purse

    container.register<IFetchPurseDetailsUseCase>("IFetchPurseDetailsUseCase",{
      useClass:FetchPurseDetailsUseCase
    })

    container.register<IFundPurseUseCase>("IFundPurseUseCase",{
      useClass:FundPurseUseCase
    })

    container.register<IWebhookHandlingUseCase>("IWebHookHandlingUseCase",{
      useClass:WebHookHandlingUseCase
    })
  }
}
