import express from 'express'
import { authentication } from '../middlewares/autheniticate.js'
import messageController from '../controllers/message.controller.js';

const router = express.Router()

router.post("/create", authentication, messageController.createMessage)
router.get("/fetch/:chatId", authentication, messageController.fetchMessage)

export default router;