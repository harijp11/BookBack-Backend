import cors from "cors";
import helmet from "helmet";
import http from "http";
import rateLimit from "express-rate-limit";
import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { config } from "../../shared/config";

import { notFound } from "../../interfaceAdapters/middlewares/not-found-middleware";
import { errorHandler } from "../../interfaceAdapters/middlewares/errorhandle-middleware";

//routes import here
import { AuthRoutes } from "../routes/auth/auth_route";
import { PrivateRoutes } from "../routes/private/private_routes";

export class Server {
  private _app: Application;
  private _server: http.Server;
  constructor() {
    this._app = express();
    this._server = http.createServer(this._app);

    this.configureMiddlewares();
    this.configureRoutes()
    this.configureErrorHandling();
  }

  private configureMiddlewares() {
    this._app.use(morgan(config.loggerStatus));
    this._app.use(helmet());

    this._app.use(
      cors({
        origin: config.cors.ALLOWED_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
      })
    );

    // this._app.use((req:Request,res:Response,next:NextFunction)=>{
    //     express.json()(req,res,next);
    // })

    this._app.use(express.json({ limit: "10mb" }));

    this._app.use(express.urlencoded({ limit: "10mb", extended: true }));

    this._app.use(cookieParser());
    this._app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
      })
    );
  }

  private configureRoutes() {
    this._app.use("/api/v1/auth", new AuthRoutes().router);
    this._app.use("/api/v1/pvt", new PrivateRoutes().router);
    this._app.use("*", notFound);
  }
  private configureErrorHandling() {
    this._app.use(errorHandler);
  }
  private getApp(): Application {
    return this._app;
  }
  public getServer(): http.Server {
    return this._server;
  }
}
