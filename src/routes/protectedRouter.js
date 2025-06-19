import { Router } from "express";
import { checkAuthenticated } from "../middlewares/auth.js";
import * as protectedController from '../controllers/protectedController.js'

const router = Router();

router.get('/', checkAuthenticated, protectedController.getProtected);
router.get('/users', checkAuthenticated, protectedController.getAllUsers);

export default router;