import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createTaskSchema, updateTaskSchema } from '../validators/tasks.validator.js';
import { createTaskController, getTaskByIdController, getTasksController, removeTaskController, updateTaskController } from '../controllers/tasks.controller.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

router.get("/", requireAuth, getTasksController);
router.post("/", requireAuth, validate(createTaskSchema), createTaskController);
router.get("/:id", requireAuth, getTaskByIdController);
router.put("/:id", requireAuth, validate(updateTaskSchema), updateTaskController);
router.delete("/:id", requireAuth, removeTaskController);

export default router