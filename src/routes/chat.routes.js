import express from 'express'
import chatController from '../controllers/chat.controller.js'
import { authentication } from '../middlewares/autheniticate.js'

const router = express.Router()

router.post("/createchat", authentication, chatController.createChat)

router.get("/findchat", authentication, chatController.findChats)


export default router 