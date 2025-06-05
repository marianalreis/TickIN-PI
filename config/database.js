const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tickin',
  password: 'sua_senha', // Você precisará alterar isso para sua senha
  port: 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Teste de conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.stack);
  } else {
    console.log('Conectado ao banco de dados PostgreSQL!');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
