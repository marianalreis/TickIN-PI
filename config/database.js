const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});

// Testar conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    console.error('Configuração do banco:', {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: process.env.DB_SSL === 'true'
    });
    return;
  }
  console.log('Conectado ao banco de dados PostgreSQL');
  release();
});

// Adicionar listener para erros
pool.on('error', (err) => {
  console.error('Erro inesperado no pool do banco de dados:', err);
});

module.exports = pool;
