import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createTaskSchema, updateTaskSchema } from '../validators/tasks.validator.js';
import { createTaskController, getTaskByIdController, getTasksController, removeTaskController, updateTaskController } from '../controllers/tasks.controller.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

// Get all tasks belonging to the authenticated user
router.get("/", requireAuth, getTasksController);

// Create a new task
router.post("/", requireAuth, validate(createTaskSchema), createTaskController);

// Get a single task by its id
router.get("/:id", requireAuth, getTaskByIdController);

// Update an existing task
router.put("/:id", requireAuth, validate(updateTaskSchema), updateTaskController);

// Delete a task
router.delete("/:id", requireAuth, removeTaskController);

export default router