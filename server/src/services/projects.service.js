import pool from "../db/pool.js";

export const getProjects = async (userId) => {
    const result = await pool.query(
        `
    SELECT
      p.id,
      p.name,
      p.scheduled_completion,
      p.status,
      p.created_at,
      p.updated_at,
      COUNT(t.id)::int AS task_count
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id AND t.user_id = p.user_id
    WHERE p.user_id = $1
    GROUP BY p.id
    ORDER BY p.scheduled_completion NULLS LAST, p.created_at DESC
    `,
        [userId]
    );

    return result.rows;
};


export const createProject = async ({
    userId,
    name,
    scheduled_completion = null,
    status = "Not Started",
}) => {
    const result = await pool.query(
        `
    INSERT INTO projects (user_id, name, scheduled_completion, status)
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      name,
      scheduled_completion,
      status,
      created_at,
      updated_at
    `,
        [userId, name, scheduled_completion, status]
    );

    return result.rows[0];
};


export const getTasksByProject = async (userId, projectId) => {
    const result = await pool.query(
        `
    SELECT
      t.id, t.title, t.due_date, t.progress, t.project_id,
      p.name AS project_name,
      t.created_at, t.updated_at
    FROM tasks t
    LEFT JOIN projects p ON p.id = t.project_id
    WHERE t.user_id = $1 AND t.project_id = $2
    ORDER BY t.due_date NULLS LAST, t.created_at DESC
    `,
        [userId, projectId]
    );

    return result.rows;
};


export const getProjectById = async (projectId, userId) => {
    const result = await pool.query(
        `
    SELECT
      p.id,
      p.name,
      p.scheduled_completion,
      p.status,
      p.created_at,
      p.updated_at,
      COUNT(t.id)::int AS task_count
    FROM projects p
    LEFT JOIN tasks t
      ON t.project_id = p.id
      AND t.user_id = p.user_id
    WHERE p.id = $1 AND p.user_id = $2
    GROUP BY p.id
    `,
        [projectId, userId]
    );

    return result.rows[0] ?? null;
};


export const updateProject = async (projectId, userId, data) => {
    const allowed = ["name", "scheduled_completion", "status"];

    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(data)) {
        if (!allowed.includes(key)) continue;

        fields.push(`${key} = $${index}`);
        values.push(value); // can be null (scheduled_completion)
        index++;
    }

    if (fields.length === 0) {
        throw new Error("No valid fields to update");
    }

    fields.push(`updated_at = NOW()`);

    values.push(projectId, userId);

    const result = await pool.query(
        `
    UPDATE projects
    SET ${fields.join(", ")}
    WHERE id = $${index} AND user_id = $${index + 1}
    RETURNING
      id,
      name,
      scheduled_completion,
      status,
      created_at,
      updated_at
    `,
        values
    );

    return result.rows[0] ?? null;
};


export const removeProject = async (projectId, userId) => {
  const result = await pool.query(
    `
    DELETE FROM projects
    WHERE id = $1 AND user_id = $2
    RETURNING
      id,
      name,
      scheduled_completion,
      status,
      created_at,
      updated_at
    `,
    [projectId, userId]
  );

  return result.rows[0] ?? null;
};