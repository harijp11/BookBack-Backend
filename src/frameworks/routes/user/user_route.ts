import { Request, RequestHandler, Response } from "express";

import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth_middleware";
import {
  blockStatusMiddleware,
  authController,
  userController,
  bookController,
  categoryController,
  dealtypeController,
} from "../../di/resolver";

import { BaseRoute } from "../base_route";

export class UserRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    let router = this.router;
    // logout
    router.post(
      "/user/logout",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkUserStatus as RequestHandler,
      (req: Request, res: Response) => {
        authController.logout(req, res);
      }
    );

    router.post(
      "/user/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        console.log("refreshing user", req.body);
        authController.handleTokenRefresh(req, res);
      }
    );

    router.get(
      "/user/cloudinary/upload-signature",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkUserStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.generateUploadSignature(req, res);
      }
    );

    router.patch(
      "/user/update-profile/:userId",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkUserStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.updateUserProfile(req, res);
      }
    );

    router.patch(
      "/user/change-password",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkUserStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.changePassword(req, res);
      }
    );

    //books

    //category and dealtype

    router.get(
      "/user/category",
      // verifyAuth,
      // authorizeRole(["user"]),
      // blockStatusMiddleware.checkUserStatus as RequestHandler,
      (req: Request, res: Response) => {
        categoryController.getCategories(req, res);
      }
    );

    router.get(
      "/user/dealtype",
      // verifyAuth,
      // authorizeRole(["user"]),
      // blockStatusMiddleware.checkUserStatus as RequestHandler,
      (req: Request, res: Response) => {
        dealtypeController.getDealTypes(req, res);
      }
    );

    //coudinarysignature

    router.get(
      "/user/book-cloudinary-signature",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkUserStatus as RequestHandler,
      (req: Request, res: Response) => {
        bookController.generateSignatureForBooksUploading(req, res);
      }
    ); 

    router
      .route("/user/book")
      .get(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req: Request, res: Response) => {
          bookController.getAllPaginatedBooks(req, res); 
        }
      )
      .post(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req: Request, res: Response) => {
          bookController.createNewBook(req, res);
        }
      )
      .patch(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req: Request, res: Response) => {
          bookController.updateBookStatus(req, res);
        }
      )

    router
      .route("/user/updatebook")
      .post(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req: Request, res: Response) => {
          // console.log("Update book route hit");
          // console.log("Request body:", req.body);
          bookController.updateBookDetails(req, res);
        }
      );


      router.get(
        "/user/books-available",
        (req: Request, res: Response) => {
          bookController.getAllAvailableUserBooks(req,res)
        }
      )

  }
}
