import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
}
);
pool.on("error", (er) => {
    console.error(`Idle error on db/db.js`, er.message)
})
pool.on("connect", () => {
    console.error(`success`)
})

export default pool;
