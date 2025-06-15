import { Router } from "express";
import { checkAuthenticated } from "../middlewares/auth.js";
import * as protectedController from '../controllers/protectedController.js'

const router = Router();

router.get('/', checkAuthenticated, protectedController.getProtected);

export default router;