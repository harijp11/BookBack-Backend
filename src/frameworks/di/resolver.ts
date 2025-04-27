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

DependancyInjection.registerAll();

export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);

//user
export const userController = container.resolve(UserController)
export const categoryController = container.resolve(CategoryController)
export const dealtypeController = container.resolve(DealTypeController)
export const bookController = container.resolve(BookController)
export const contractRequestController = container.resolve(ContractRequestController)
export const purseController = container.resolve(PurseController)





   
export const authController = container.resolve(AuthController);