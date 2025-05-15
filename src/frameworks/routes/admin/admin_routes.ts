import { Request, Response } from "express";

import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth_middleware";

import { BaseRoute } from "../base_route";

import {
  authController,
  userController,
  categoryController,
  dealtypeController,
  bookController,
  saleController,
  rentController,
  returnRejectionRequestController,
  dashboardController,
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
        userController.getAllUsers(req, res);
      }
    );

    router.patch(
      "/admin/user-status",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        userController.updateUserStatus(req, res);
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
          categoryController.getAllPaginatedCategories(req, res);
        }
      )
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          categoryController.createNewCategory(req, res);
        }
      );

    router
      .route("/admin/categories/:categoryId")
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          categoryController.updateCategoryStatus(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          categoryController.updateCategory(req, res);
        }
      );

    //deal types routes

    router
      .route("/admin/deal-types")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          dealtypeController.getAllPaginatedDealTypes(req, res);
        }
      )
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          dealtypeController.createDealType(req, res);
        }
      );

    router
      .route("/admin/deal-types/:_id")
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          dealtypeController.updateDealTypeStatus(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          dealtypeController.updateDealType(req, res);
        }
      );

    router.get(
      "/admin/category",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        categoryController.getAllCategories(req, res);
      }
    );

    router.get(
      "/admin/dealtype",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        dealtypeController.getDealTypes(req, res);
      }
    );

    router
      .route("/admin/book")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          bookController.getAllAdminPaginatedBooks(req, res);
        }
      )
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          bookController.updateBookStatus(req, res);
        }
      );


      //contracts

      
    router
    .route("/admin/sale/contract")
    .get(
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        saleController.fetchAdminSoldBooksContract(req, res);
      }
    )


    router
    .route("/admin/rent/contract")
    .get(
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        rentController.getAdminRentedOutBooksContract(req, res);
      }
    )


    //return rejection request

    router
    .route("/admin/return-rejection-request")
    .get(
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        returnRejectionRequestController.fetchAllPaginatedAdminReturnRequest(req, res);
      }
    )

    router
    .route("/admin/return-rejection-request/:retRejId/update")
    .put(
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        returnRejectionRequestController.updateReturnRejectionRequestStatus(req, res);
      }
    )

    router
    .route("/admin/fetch-dashboard")
    .get(
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        dashboardController.fetchDashboardDetails(req, res);
      }
    )



  }
}
