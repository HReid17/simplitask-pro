import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createProjectSchema, updateProjectSchema } from '../validators/projects.validator.js';
import { createProjectController, getProjectByIdController, getProjectsController, getProjectTasksController, removeProjectController, updateProjectController } from '../controllers/projects.controller.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

router.get("/", requireAuth, getProjectsController);
router.post("/", requireAuth, validate(createProjectSchema), createProjectController);
router.get("/:id/tasks", requireAuth, getProjectTasksController);
router.get("/:id", requireAuth, getProjectByIdController);
router.put("/:id", requireAuth, validate(updateProjectSchema), updateProjectController);
router.delete("/:id", requireAuth, removeProjectController);

export default router