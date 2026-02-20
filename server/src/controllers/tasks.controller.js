import { getTasks, createTask, getTaskById, updateTask, removeTask } from "../services/tasks.service.js";

export const getTasksController = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const tasks = await getTasks(req.user.id);

        return res.status(200).json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        return res.status(500).json({ message: "Failed to fetch tasks" });
    }
};


export const createTaskController = async (req, res) => {
  try {
    const userId = req.user.id;          
    const task = await createTask({      
      userId,
      ...req.body,
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);

    if (err.message === "Invalid project selection") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Failed to create task" });
  }
};


export const getTaskByIdController = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await getTaskById(taskId, userId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    return res.status(500).json({ message: "Failed to fetch task" });
  }
};


export const updateTaskController = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const updatedTask = await updateTask(taskId, userId, req.body);

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);

    if (err.message === "Invalid project selection") {
      return res.status(400).json({ message: err.message });
    }

    if (err.message === "No valid fields to update") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Failed to update task" });
  }
};


export const removeTaskController = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const deletedTask = await removeTask(taskId, userId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(deletedTask);
  } catch (err) {
    console.error("Error deleting task:", err);
    return res.status(500).json({ message: "Failed to delete task" });
  }
};