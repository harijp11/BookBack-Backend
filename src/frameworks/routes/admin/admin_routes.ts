import { Request, Response } from "express";

import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth_middleware";

import { BaseRoute } from "../base_route";

import {
  authController,
  adminUserController,
  admincategoryController,
  adminDealTypeController,


  userController
} from "../../di/resolver";

export class AdminRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    let router = this.router;

    // logout
    router.post(
      "/admin/logout",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        authController.logout(req, res);
      }
    );

    router.get(
      "/admin/users",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        adminUserController.getAllUsers(req, res);
      }
    );

    router.patch(
      "/admin/user-status",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        adminUserController.updateUserStatus(req, res);
      }
    );

    router.post(
      "/admin/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        authController.handleTokenRefresh(req, res);
      }
    );

  
    router
      .route("/admin/categories")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          admincategoryController.getAllPaginatedCategories(req, res);
        }
      )
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          admincategoryController.createNewCategory(req,res)
        }
      );

    router
      .route("/admin/categories/:categoryId")
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          admincategoryController.updateCategoryStatus(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          admincategoryController.updateCategory(req, res);
        }
      )

      //deal types routes

      router
        .route("/admin/deal-types")
        .get(
          verifyAuth,
          authorizeRole(["admin"]),
          (req:Request,res:Response)=>{
            adminDealTypeController.getAllPaginatedDealTypes(req,res)
          }
        )
        .post(
          verifyAuth,
          authorizeRole(["admin"]),
          (req:Request,res:Response)=>{
            adminDealTypeController.createDealType(req,res)
          }
        )

        router
          .route("/admin/deal-types/:_id")
          .patch(
            verifyAuth,
            authorizeRole(["admin"]),
            (req:Request,res:Response)=>{
              adminDealTypeController.updateDealTypeStatus(req,res)
            }
          )
          .put(
            verifyAuth,
            authorizeRole(["admin"]),
            (req:Request,res:Response)=>{
              adminDealTypeController.updateDealType(req,res)
            }
          )
  }
}
