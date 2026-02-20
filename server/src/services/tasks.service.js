import pool from "../db/pool.js";

export const getTasks = async (userId) => {
  try {
    const result = await pool.query(
      `
      SELECT
        t.id,
        t.title,
        t.due_date,
        t.progress,
        t.project_id,
        p.name AS project_name,
        t.created_at,
        t.updated_at
      FROM tasks t
      LEFT JOIN projects p ON p.id = t.project_id
      WHERE t.user_id = $1
      ORDER BY t.due_date NULLS LAST, t.created_at DESC
      `,
      [userId]
    );

    return result.rows;
  } catch (err) {
    throw err;
  }
};


export const createTask = async ({
  userId,
  title,
  due_date,
  progress = 0,
  project_id = null,
}) => {
  try {
    // If project_id exists, verify it belongs to the user
    if (project_id) {
      const projectCheck = await pool.query(
        `SELECT id FROM projects WHERE id = $1 AND user_id = $2`,
        [project_id, userId]
      );

      if (projectCheck.rowCount === 0) {
        throw new Error("Invalid project selection");
      }
    }

    // Insert task
    const result = await pool.query(
      `
      INSERT INTO tasks (user_id, project_id, title, due_date, progress)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        title,
        due_date,
        progress,
        project_id,
        created_at,
        updated_at
      `,
      [userId, project_id, title, due_date, progress]
    );

    return result.rows[0];
  } catch (err) {
    throw err;
  }
};


export const getTaskById = async (taskId, userId) => {
  try {
    const result = await pool.query(
      `
      SELECT
        t.id,
        t.title,
        t.due_date,
        t.progress,
        t.project_id,
        p.name AS project_name,
        t.created_at,
        t.updated_at
      FROM tasks t
      LEFT JOIN projects p ON p.id = t.project_id
      WHERE t.id = $1 AND t.user_id = $2
      `,
      [taskId, userId]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  } catch (err) {
    throw err;
  }
};


export const updateTask = async (id, userId, data) => {
  try {
    // if project_id is being set (and not null), verify it belongs to the user
    if (Object.prototype.hasOwnProperty.call(data, "project_id") && data.project_id !== null) {
      const projectCheck = await pool.query(
        `SELECT id FROM projects WHERE id = $1 AND user_id = $2`,
        [data.project_id, userId]
      );

      if (projectCheck.rowCount === 0) {
        throw new Error("Invalid project selection");
      }
    }

    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(data)) {
      // Only allow columns wanted to update (prevents client updating random fields)
      const allowed = ["title", "due_date", "progress", "project_id"];
      if (!allowed.includes(key)) continue;

      fields.push(`${key} = $${index}`);
      values.push(value); // value can be null - enables "Unassigned"
      index++;
    }

    // If no valid fields provided return current task (or throw)
    if (fields.length === 0) {
      throw new Error("No valid fields to update");
    }

    // Always update updated_at
    fields.push(`updated_at = NOW()`);

    // Scope by user_id so users can't edit others' tasks
    const query = `
      UPDATE tasks
      SET ${fields.join(", ")}
      WHERE id = $${index} AND user_id = $${index + 1}
      RETURNING id, title, due_date, progress, project_id, created_at, updated_at
    `;

    values.push(id, userId);

    const result = await pool.query(query, values);

    // If no row updated, task doesn't exist or doesn't belong to user
    if (result.rowCount === 0) return null;

    return result.rows[0];
  } catch (err) {
    throw err;
  }
};


export const removeTask = async (taskId, userId) => {
  const result = await pool.query(
    `
    DELETE FROM tasks
    WHERE id = $1 AND user_id = $2
    RETURNING id, title, due_date, progress, project_id, created_at, updated_at
    `,
    [taskId, userId]
  );

  return result.rows[0] ?? null;
};


