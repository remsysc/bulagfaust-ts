require("dotenv").config();
const pool = require("./index.js");

const createTable = async () => {
  const client = await pool.connect();
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS users(
          id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username  VARCHAR(255) NOT NULL UNIQUE,
          email     VARCHAR(255) NOT NULL UNIQUE,
          password  VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP NOT NULL DEFAULT NOW()
    )
      `,
    );
    console.log("users table ready");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles(
          id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name  VARCHAR(255) NOT NULL UNIQUE
)
`);
    console.log("roles table ready");
    await pool.query(
      `CREATE TABLE IF NOT EXISTS user_roles(
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
            PRIMARY KEY(user_id, role_id)
)`,
    );
    console.log("user_roles table ready");
    console.log("migration complete");
  } catch (err) {
    console.error("migration failed: ", err.message);
  } finally {
    client.release();
  }
};

createTable();
