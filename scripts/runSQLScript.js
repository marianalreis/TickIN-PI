const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

const runSQLScript = async (sqlFile) => {
  try {
    console.log('Executando script SQL...');
    
    // Read and execute the SQL file
    const sqlScript = fs.readFileSync(sqlFile, 'utf8');
    await pool.query(sqlScript);
    
    console.log('Script SQL executado com sucesso!');
  } catch (err) {
    console.error('Erro ao executar script SQL:', err);
  } finally {
    await pool.end();
  }
};

// Get the SQL file path from command line arguments
const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error('Por favor, forneça o caminho do arquivo SQL como argumento.');
  process.exit(1);
}

runSQLScript(sqlFile);
