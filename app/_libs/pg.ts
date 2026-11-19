import { Pool } from "pg";

// Configuración del pool de conexiones
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  max: 20, // máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Para queries simples
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Para transacciones
export const getClient = () => pool.connect();

// Para cerrar la conexión al apagar la app
export const shutdown = async () => await pool.end();

export default pool;
