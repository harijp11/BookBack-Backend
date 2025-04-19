import { container } from "tsyringe";
import { DependancyInjection } from "./index";
import { BlockStatusMiddleware } from "../../interfaceAdapters/middlewares/block_status_middleware";

import { AuthController } from "../../interfaceAdapters/controllers/Auth/auth-controller";
import { AdminUserController } from "../../interfaceAdapters/controllers/Admin/admin_user-controller";
import { AdminCategoryController } from "../../interfaceAdapters/controllers/Admin/admin_category-controller";
import { AdminDealTypeController } from "../../interfaceAdapters/controllers/Admin/admin_deal_type-controller";

import { UserController } from "../../interfaceAdapters/controllers/User/user-controller";
import { BookController } from "../../interfaceAdapters/controllers/User/book-controller";
import { CategoryController } from "../../interfaceAdapters/controllers/User/category-controller";
import { DealTypeController } from "../../interfaceAdapters/controllers/User/deal_type-controller";
import { AdminBookController } from "../../interfaceAdapters/controllers/Admin/admin_book-controller";

DependancyInjection.registerAll();

export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);

export const adminUserController = container.resolve(AdminUserController);
export const admincategoryController = container.resolve(AdminCategoryController)
export const adminDealTypeController = container.resolve(AdminDealTypeController)
export const adminBookController = container.resolve(AdminBookController)


//user
export const userController = container.resolve(UserController)
export const categoryController = container.resolve(CategoryController)
export const dealtypeController = container.resolve(DealTypeController)


//book
export const bookController = container.resolve(BookController)




   
export const authController = container.resolve(AuthController);