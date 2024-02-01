import { Router } from "express";
import { createService, getService, listServices, removeServiceFromCategory, updateOrDeleteService } from "../controllers/service.controller.js";
import { createCategory, listCategories, removeCategory, updateCategory } from "../controllers/category.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router()

router.post('/', verifyUser, createCategory)
router.get('/list', verifyUser, listCategories)
router.put('/:categoryId', verifyUser, updateCategory)
router.delete('/:categoryId', verifyUser, removeCategory)
router.post('/:categoryId/service', verifyUser, createService)
router.delete('/:categoryId/service/:serviceId', verifyUser, removeServiceFromCategory)
router.get('/:categoryId/service/:serviceId', verifyUser, getService)
router.put('/:categoryId/service/:serviceId', verifyUser, updateOrDeleteService)


export default router