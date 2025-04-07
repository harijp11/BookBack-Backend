import { container } from "tsyringe";

import { IUserRepository } from "../../entities/repositoryInterface/user/user_repository-interface";
import { UserRepository } from "../../interfaceAdapters/repositories/user/user-repository";
import { IRedisTokenRepository } from "../../entities/repositoryInterface/redis/redis_token_repository-interface";
import { RedisTokenRepository } from "../../interfaceAdapters/repositories/redis/redis_token_repository";
import { IOtpRepository } from "../../entities/repositoryInterface/auth/otp_repository-interface";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp_repository";
import { IRefreshTokenRepository } from "../../entities/repositoryInterface/auth/refresh_token_repository-interface";
import { RefreshTokenRepository } from "../../interfaceAdapters/repositories/auth/refreshToken_repository";
import { IAdminRepository } from "../../entities/repositoryInterface/admin/admin_repository-interface";
import { AdminRepository } from "../../interfaceAdapters/repositories/admin/admin_repository";
import { CategoryRepository } from "../../interfaceAdapters/repositories/common/category-repository";
import { ICategoryRepository } from "../../entities/repositoryInterface/common/category_repository-interface";
import { IDealTypeRepository } from "../../entities/repositoryInterface/common/deal_type_repository-interface";
import { DealTypeRepository } from "../../interfaceAdapters/repositories/common/deal_type-repository";
import { IUpdateDealTypeStatusUseCase } from "../../entities/useCaseInterfaces/admin/dealType/update_deal_type_status_usecase-interface";
import { updateDealTypeStatusUseCase } from "../../useCases/admin/dealType/update_deal_type_status-usecase";
import { IUpdateDealTypeUseCase } from "../../entities/useCaseInterfaces/admin/dealType/update_deal_type_usecase-interface";
import { UpdateDealTypeUseCase } from "../../useCases/admin/dealType/update_deal_type_usecase";

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

    container.register<ICategoryRepository>("ICategoryRepository",{
      useClass: CategoryRepository
    })

    container.register<IDealTypeRepository>("IDealTypeRepository",{
      useClass: DealTypeRepository
    })

    container.register<IUpdateDealTypeStatusUseCase>("IUpdateDealTypeStatusUseCase",{
      useClass:updateDealTypeStatusUseCase
    })

    container.register<IUpdateDealTypeUseCase>("IUpdateDealTypeUseCase",{
      useClass:UpdateDealTypeUseCase
    })

}
}