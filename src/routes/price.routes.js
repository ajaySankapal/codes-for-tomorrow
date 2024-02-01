import { Router } from "express";
import { createServicePrice } from "../controllers/price.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router()

router.post('/service/:serviceId', verifyUser, createServicePrice)

export default router