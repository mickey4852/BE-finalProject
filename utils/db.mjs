import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ 
    connectionString: 
    `postgres://postgres:password@localhost:5432/bookCollection`
});

export default pool;