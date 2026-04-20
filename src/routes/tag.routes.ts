import { Router } from "express";
import * as tagController from "@/controller/tag.controller";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/requireRole.middleware";
import { validate_uuid } from "@/middlewares/validator.middleware";

const router = Router();

router.get("/", tagController.getTags);
router.get("/:tagId", validate_uuid("tagId"), tagController.getTagById);
router.post(
  "/",
  authenticateToken,
  requireRole("ROLE_ADMIN"),
  tagController.createTag,
);
router.delete(
  "/:tagId",
  authenticateToken,
  validate_uuid("tagId"),
  tagController.deleteById,
);

export default router;
