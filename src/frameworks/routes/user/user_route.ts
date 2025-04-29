import express,{ Request, RequestHandler, Response } from "express";

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
  contractRequestController,
  purseController,
  contractController,
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
      (req: Request, res: Response) => {
        categoryController.getAllCategories(req, res);
      }
    );

    router.get(
      "/user/dealtype",
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

    // router
    //   .route("/user/updatebook")
      .put(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req: Request, res: Response) => {
          bookController.updateBookDetails(req, res);
        }
      );


      router.get(
        "/user/books-available",
        (req: Request, res: Response) => {
          bookController.getAllAvailableUserBooks(req,res)
        }
      )

      router.get(
        "/user/book-Details/:_id",
        (req: Request, res: Response) => {
          bookController.getUserBookDetails(req,res)
        }
      )

      
      router.get(
        "/user/related-books/:catId", 
        (req: Request, res: Response) => {
          bookController.getRelatedBooks(req,res)
        }
      )


      //contract request routes

      router.get("/user/check-Request-exist",
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req:Request,res:Response)=>{
          contractRequestController.checkBookRequestExist(req,res)
        }
      )
      

      router
      .route("/user/contract-request")
      .post(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req:Request,res:Response)=>{
          contractRequestController.createNewContractRequest(req,res)
        }
      )


      router
      .route("/user/owner/contract-request")
      .get(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req:Request,res:Response)=>{
          contractRequestController.fetchAllOwnerContractRequests(req,res)
        }
      )
      .patch(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req:Request,res:Response)=>{
          console.log("cookies")
          contractRequestController.contractRequestStatusUpdate(req,res)
        }
      )

      router
      .route("/user/contract-request")
      .get(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req:Request,res:Response)=>{
          contractRequestController.fetchRequesterRequest(req,res)
        }
      )

      router
      .route("/user/contract-request/:conReqId/cancel")
      .patch(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req:Request,res:Response)=>{
          contractRequestController.cancelContractRequest(req,res)
        }
      )

      router
      .route("/user/fix-deal")
      .get(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req:Request,res:Response)=>{
          contractRequestController.fetchFixDealDetails(req,res)
        }
      )

      //contract 

      router
      .route("/user/contract/send-otp")
      .post(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req:Request,res:Response)=>{
          contractController.sendOtpEmail(req,res)
        }
      )

      router
      .route("/user/contract/verify-otp")
      .post(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,   
        (req:Request,res:Response)=>{
          contractController.verifyOtp(req,res)
        }
      )


      router
      .route(`/user/contract/:request_type/:conReqId/create`)
      .post(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req:Request,res:Response)=>{
          contractController.createNewContract(req,res)
        }
      )
  
      





      //purse

      router
      .route("/user/purse")
      .get(
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkUserStatus as RequestHandler,
        (req:Request,res:Response)=>{
          purseController.fetchPurseDetails(req,res)
        }
      )

      router
  .route('/user/purse/payment-intent')
  .post(
    verifyAuth,
    authorizeRole(['user']),
    blockStatusMiddleware.checkUserStatus as RequestHandler,
    (req: Request, res: Response) => {
      purseController.createPaymentIntent(req, res);
    }
  );

router
  .route('/webhook')
  .post(
    express.raw({ type: 'application/json', limit: '10mb' }),
    (req: Request, res: Response) => {
      purseController.handleWebhook(req, res);
    }
  );
  }
}
