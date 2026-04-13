import pool from "@/db";
import { Tag } from "@/types/entities";

export const findAll = async (): Promise<Tag[]> => {
  const result = await pool.query<Tag>(
    `SELECT id, name, created_at FROM tags LIMIT 10 `,
  );
  return result.rows;
};

export const findById = async (id: string): Promise<Tag> => {
  const result = await pool.query<Tag>(
    `SELECT id, name, created_at FROM tags 
    WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
};

export const createTag = async (name: string): Promise<Tag> => {
  const result = await pool.query<Tag>(
    `INSERT INTO tags(name)VALUES($1)
    RETURNING id, name, created_at `,
    [name],
  );
  return result.rows[0];
};

export const deleteById = async (id: string): Promise<void> => {
  await pool.query(
    `
      DELETE FROM tags WHERE id = $1
`,
    [id],
  );
};

export const existsByNameExcludeId = async (
  name: string,
  id?: string,
): Promise<boolean> => {
  const res = await pool.query(
    `SELECT EXISTS(SELECT 1 FROM tags WHERE name = $1 AND id != $2)`,
    [name, id],
  );

  return res.rows[0].exists;
};

export const existsById = async (id: string): Promise<boolean> => {
  const res = await pool.query(
    `SELECT EXISTS(SELECT 1 FROM tags WHERE id = $1)`,
    [id],
  );
  return res.rows[0].exists;
};
