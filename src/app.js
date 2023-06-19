import express from 'express'
import http from 'http'
import userRoutes from './routes/user.routes.js'
import chatRoutes from './routes/chat.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

/**
 * express app
 */


const app = express()


/**
 * http server
 */


const server = http.createServer(app)



/**
 * app uses
 */
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["POST", "GET", "PUT"]
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use("/chat", chatRoutes)
app.use("/user", userRoutes)


/**
 * root route for checking 
 */



app.get("/", (req, res) => {
    res.send("server working")
})

/**
 * Socket io connection
 */


export default server