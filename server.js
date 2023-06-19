import server from "./src/app.js";
import { config } from "dotenv";
import path from 'path'
import DB_CONNECT from "./src/database/db.js";





/**
 * configure dot env
 */


const ENV_Path = "src/private/private.env"

config({ path: path.join(process.cwd(), ENV_Path) })




/**
 * Database connection
 */



DB_CONNECT()




/**
 * Listening server
 */


server.listen(
    process.env.PORT,
    () => {
        console.log(`SERVER RUNNING ON ${process.env.PORT}`)
    }
)