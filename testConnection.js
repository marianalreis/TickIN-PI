const pool = require('./config/database');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar:', err);
  } else {
    console.log('Conectado com sucesso:', res.rows);
  }
  pool.end();
});
