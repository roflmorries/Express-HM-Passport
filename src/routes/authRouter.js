import { Router } from "express";
import passport from "passport";
import * as authController from '../controllers/userController.js'

const router = Router();

router.post('/register', authController.register);

router.post('/login', passport.authenticate('local'), authController.login);

router.post('/logout', authController.logout);

router.post('/forgot', authController.forgotPassword);

router.post('/reset/:token', authController.resetPassword);

export default router;