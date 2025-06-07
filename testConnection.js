const { Pool } = require('pg');
require('dotenv').config();

console.log('Configurações do banco de dados:');
console.log('- DB_USER:', process.env.DB_USER);
console.log('- DB_HOST:', process.env.DB_HOST);
console.log('- DB_NAME:', process.env.DB_NAME);
console.log('- DB_PORT:', process.env.DB_PORT);
console.log('- DB_PASSWORD:', process.env.DB_PASSWORD ? '[DEFINIDO]' : '[NÃO DEFINIDO]');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar:', err);
  } else {
    console.log('Conectado com sucesso:', res.rows);
  }
  pool.end();
});
