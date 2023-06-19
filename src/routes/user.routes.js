import express from 'express'
import userController from '../controllers/user.controller.js'
import { authentication } from '../middlewares/autheniticate.js'

const router = express.Router()

/**
 * Login
 */


router.post("/login", userController.loginUser)


/**
 * Registration
 */


router.post("/register", userController.createUser)

/**
 * Logout
 */

router.get("/logout", userController.logoutUser)


/**
 * Refresh
 */

router.get("/refresh", userController.refresh)


/**
 * Finduser
 */

router.get("/finduser",authentication,userController.findUsers)

export default router