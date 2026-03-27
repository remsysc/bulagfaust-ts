import { requireRole } from "@/middlewares/requireRole.middleware";
import { Router } from "express";
import * as categoryController from "@/controller/category.controller";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { validate_uuid } from "@/middlewares/validator.middleware";

const router = Router();

router.get("/", categoryController.getCategories);
router.get("/:categoryId", categoryController.getCategoryById);
router.post(
  "/",
  authenticateToken,
  requireRole("ROLE_ADMIN"),
  categoryController.createCategory,
);
router.put(
  "/:categoryId",
  authenticateToken,
  requireRole("ROLE_ADMIN"),
  validate_uuid("categoryId"),
  categoryController.updateCategory,
);
router.delete(
  "/:categoryId",
  authenticateToken,
  requireRole("ROLE_ADMIN"),
  validate_uuid("categoryId"),
  categoryController.deleteCategory,
);

export default router;
