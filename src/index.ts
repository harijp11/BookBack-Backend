import "reflect-metadata"
//import resolver
import { MongoConnect } from "./frameworks/database/mongoDB/mongoConnect"
import { Server } from "./frameworks/http/server"
import { config } from "./shared/config"


const server = new Server()
const mongoConnect = new MongoConnect()

mongoConnect.connectDB()

server.getServer()
.listen(config.server.PORT,()=>
console.log( `Server is running on http://${config.server.HOST}:${config.server.PORT}`))