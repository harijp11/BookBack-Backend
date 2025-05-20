import "reflect-metadata"
//import resolver
import { MongoConnect } from "./frameworks/database/mongoDB/mongoConnect"
import { Server } from "./frameworks/http/server"
import { config } from "./shared/config"
import { SocketServer } from "./frameworks/socket/socket_server"
import { container } from "tsyringe"

import startRentStatusCron from "./interfaceAdapters/crons/rent_status_check_and_update-cron"
import startContractPenaltyCron from "./interfaceAdapters/crons/check_status_and_update_penalty_amount_and_wallet-cron"
import startNotificationCleanupCron from "./frameworks/di/resolver"


const server = new Server()
const mongoConnect = new MongoConnect()

mongoConnect.connectDB()

const httpServer = server.getServer();

// Initialize Socket Server
const socketServer = container.resolve(SocketServer);
   
socketServer.initialize(httpServer);

//cron jobs
startRentStatusCron()
startContractPenaltyCron()
startNotificationCleanupCron();

server.getServer()
.listen(config.server.PORT,()=>
console.log( `Server is running on http://${config.server.HOST}:${config.server.PORT}`))