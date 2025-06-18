import { container } from "tsyringe";

import { IUserRepository } from "../../entities/repositoryInterface/user/user_repository-interface";
import { UserRepository } from "../../interfaceAdapters/repositories/user/user-repository";
import { IRedisTokenRepository } from "../../entities/repositoryInterface/redis/redis_token_repository-interface";
import { RedisTokenRepository } from "../../interfaceAdapters/repositories/redis/redis_token-repository";
import { IOtpRepository } from "../../entities/repositoryInterface/auth/otp_repository-interface";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp-repository";
import { IRefreshTokenRepository } from "../../entities/repositoryInterface/auth/refresh_token_repository-interface";
import { RefreshTokenRepository } from "../../interfaceAdapters/repositories/auth/refreshToken-repository";
import { IAdminRepository } from "../../entities/repositoryInterface/admin/admin_repository-interface";
import { AdminRepository } from "../../interfaceAdapters/repositories/admin/admin-repository";
import { CategoryRepository } from "../../interfaceAdapters/repositories/common/category-repository";
import { ICategoryRepository } from "../../entities/repositoryInterface/common/category_repository-interface";
import { IDealTypeRepository } from "../../entities/repositoryInterface/common/deal_type_repository-interface";
import { DealTypeRepository } from "../../interfaceAdapters/repositories/common/deal_type-repository";
import { IBookRepository } from "../../entities/repositoryInterface/common/book_repository-interface";
import { BookRepository } from "../../interfaceAdapters/repositories/common/book-repository";
import { IContractRequestRepository } from "../../entities/repositoryInterface/user/contract_request_repository-interface";
import { ContractRequestRepository } from "../../interfaceAdapters/repositories/user/contract_request-repository";
import { IPurseRepository } from "../../entities/repositoryInterface/user/purse_repository-interface";
import { PurseRepository } from "../../interfaceAdapters/repositories/user/purse-repository";
import { ISaleRepository } from "../../entities/repositoryInterface/common/sale_repository-interface";
import { SaleRepository } from "../../interfaceAdapters/repositories/common/sale-repository";
import { IRentRepository } from "../../entities/repositoryInterface/common/rent_repository-interface";
import { RentRepository } from "../../interfaceAdapters/repositories/common/rent-repository";
import { IReturnRejectionRequestRepository } from "../../entities/repositoryInterface/common/return_rejection_request_repository-interface";
import { ReturnRejectionRequestRepository } from "../../interfaceAdapters/repositories/common/return_rejection_request-repository";
import { IChatRepository } from "../../entities/repositoryInterface/user/chat_repository-interface";
import { ChatRepository } from "../../interfaceAdapters/repositories/user/chat_repository";
import { IMessageRepository } from "../../entities/repositoryInterface/user/message_repository-interface";
import { MessageRepository } from "../../interfaceAdapters/repositories/user/message_repository";
import { INotificationRepository } from "../../entities/repositoryInterface/user/notification_repository-interface";
import { NotificationRepository } from "../../interfaceAdapters/repositories/user/notification_repository";

export class RepositoryRegistry {
  static registerRepositories(): void {

   

    container.register<IUserRepository>("IClientRepository", {
      useClass: UserRepository,
    });

    container.register<IOtpRepository>("IOtpRepository", {
      useClass: OtpRepository,
    });

    container.register<IRedisTokenRepository>("IRedisTokenRepository", {
      useClass: RedisTokenRepository,
    });

    container.register<IRefreshTokenRepository>("IRefreshTokenRepository", {
      useClass: RefreshTokenRepository,
    });

    container.register<IAdminRepository>("IAdminRepository", {
      useClass: AdminRepository,
    });

    container.register<ICategoryRepository>("ICategoryRepository", {
      useClass: CategoryRepository,
    });

    container.register<IDealTypeRepository>("IDealTypeRepository", {
      useClass: DealTypeRepository,
    });

    container.register<IBookRepository>("IBookRepository", {
      useClass: BookRepository,
    });

    container.register<IContractRequestRepository>(
      "IContractRequestRepository",
      {
        useClass: ContractRequestRepository,
      }
    );

    container.register<IPurseRepository>("IPurseRepository", {
      useClass: PurseRepository,
    });

    container.register<ISaleRepository>("ISaleRepository", {
      useClass: SaleRepository,
    });

    container.register<IRentRepository>("IRentRepository", {
      useClass: RentRepository,
    });

    container.register<IReturnRejectionRequestRepository>(
      "IReturnRejectionRequestRepository",
      {
        useClass: ReturnRejectionRequestRepository,
      }
    );

    container.register<IChatRepository>("IChatRepository", {
      useClass: ChatRepository,
    });

    container.register<IMessageRepository>("IMessageRepository", {
      useClass: MessageRepository,
    });

    container.register<INotificationRepository>("INotificationRepository", {
      useClass: NotificationRepository,
    });
  }
}
