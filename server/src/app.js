import cors from "cors";
import express from 'express';

import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/tasks.routes.js';
import projectRoutes from './routes/projects.routes.js';

import pool from './db/pool.js';

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// API health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// DB health check
app.get("/db-health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now;");
    res.json({ db: "ok", now: result.rows[0].now });
  } catch (err) {
    console.error("DB healthcheck failed:", err.message);
    console.error(err);
    res.status(500).json({ db: "error" });
  }
});

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/projects", projectRoutes)

export default app;