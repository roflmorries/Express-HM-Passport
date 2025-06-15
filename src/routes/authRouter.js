import { Router } from "express";
import passport from "passport";
import * as authController from '../controllers/userController.js'

const router = Router();

router.post('/register', authController.register);
router.post('/login', passport.authenticate('local'), authController.login);
router.post('/logout', authController.logout);
router.post('/forgot', authController.forgotPassword);
router.post('/reset/:token', authController.resetPassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), authController.login);

export default router;