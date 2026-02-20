import { createProject, getProjectById, getProjects, updateProject, removeProject, getTasksByProject } from "../services/projects.service.js";

export const getProjectsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const projects = await getProjects(userId);

        return res.status(200).json(projects);
    } catch (err) {
        console.error("Error fetching projects:", err);
        return res.status(500).json({ message: "Failed to fetch projects" });
    }
};


export const createProjectController = async (req, res) => {
    try {
        const userId = req.user.id;

        const project = await createProject({
            userId,
            ...req.body,
        });

        return res.status(201).json(project);
    } catch (err) {
        console.error("Error creating project:", err);
        return res.status(500).json({ message: "Failed to create project" });
    }
};


export const getProjectTasksController = async (req, res) => {
    try {
        const userId = req.user.id;
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({ message: "Invalid project id" });
        }

        const tasks = await getTasksByProject(userId, projectId);

        return res.status(200).json(tasks);
    } catch (err) {
        console.error("Error fetching project tasks:", err);
        return res.status(500).json({ message: "Failed to fetch project tasks" });
    }
};


export const getProjectByIdController = async (req, res) => {
    try {
        const userId = req.user.id;
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({ message: "Invalid project id" });
        }

        const project = await getProjectById(projectId, userId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json(project);
    } catch (err) {
        console.error("Error fetching project:", err);
        return res.status(500).json({ message: "Failed to fetch project" });
    }
};


export const updateProjectController = async (req, res) => {
    try {
        const userId = req.user.id;
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({ message: "Invalid project id" });
        }

        const updated = await updateProject(projectId, userId, req.body);

        if (!updated) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json(updated);
    } catch (err) {
        console.error("Error updating project:", err);

        if (err.message === "No valid fields to update") {
            return res.status(400).json({ message: err.message });
        }

        return res.status(500).json({ message: "Failed to update project" });
    }
};


export const removeProjectController = async (req, res) => {
    try {
        const userId = req.user.id;
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({ message: "Invalid project id" });
        }

        const deleted = await removeProject(projectId, userId);

        if (!deleted) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json(deleted);
    } catch (err) {
        console.error("Error deleting project:", err);
        return res.status(500).json({ message: "Failed to delete project" });
    }
};