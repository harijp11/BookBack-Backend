import { container } from "tsyringe";
import { DependancyInjection } from "./index";
import { BlockStatusMiddleware } from "../../interfaceAdapters/middlewares/block_status_middleware";

import { AuthController } from "../../interfaceAdapters/controllers/Auth/auth-controller";

import { UserController } from "../../interfaceAdapters/controllers/user-controller";
import { BookController } from "../../interfaceAdapters/controllers/book-controller";
import { CategoryController } from "../../interfaceAdapters/controllers/category-controller";
import { DealTypeController } from "../../interfaceAdapters/controllers/deal_type-controller";
import { ContractRequestController } from "../../interfaceAdapters/controllers/contract_request-controller";
import { PurseController } from "../../interfaceAdapters/controllers/purse-controller";
import { ContractController } from "../../interfaceAdapters/controllers/contract-controller";
import { SaleController } from "../../interfaceAdapters/controllers/sale-controller";
import { RentalController } from "../../interfaceAdapters/controllers/rental-controller";
import { ReturnRejectionRequestController } from "../../interfaceAdapters/controllers/return_rejection_request-controller";
import { ChatController } from "../../interfaceAdapters/controllers/chat/chat_controller";
import { DashboardController } from "../../interfaceAdapters/controllers/dashboard-controller";

DependancyInjection.registerAll();

export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);

//user
export const userController = container.resolve(UserController)
export const categoryController = container.resolve(CategoryController)
export const dealtypeController = container.resolve(DealTypeController)
export const bookController = container.resolve(BookController)
export const contractRequestController = container.resolve(ContractRequestController)
export const purseController = container.resolve(PurseController)

export const contractController = container.resolve(ContractController)
export const saleController = container.resolve(SaleController)
export const rentController = container.resolve(RentalController)
export const returnRejectionRequestController = container.resolve(ReturnRejectionRequestController)
export const chatController = container.resolve(ChatController)
export const dashboardController = container.resolve(DashboardController)




export const authController = container.resolve(AuthController);