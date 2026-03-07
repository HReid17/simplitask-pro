import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createProjectSchema, updateProjectSchema } from '../validators/projects.validator.js';
import { createProjectController, getProjectByIdController, getProjectsController, getProjectTasksController, removeProjectController, updateProjectController } from '../controllers/projects.controller.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

// Get all projects belonging to the authenticated user
router.get("/", requireAuth, getProjectsController);

// Create a new project
router.post("/", requireAuth, validate(createProjectSchema), createProjectController);

// Get all tasks that belong to a specific project
router.get("/:id/tasks", requireAuth, getProjectTasksController);

// Get a single project by its id
router.get("/:id", requireAuth, getProjectByIdController);

// Update an existing project
router.put("/:id", requireAuth, validate(updateProjectSchema), updateProjectController);

// Delete a project
router.delete("/:id", requireAuth, removeProjectController);

export default router