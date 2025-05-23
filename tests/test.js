const db = require('../config/database');

db.query('SELECT NOW()')
  .then(res => {
    console.log('Conexão bem-sucedida:', res.rows[0]);
    process.exit();
  })
  .catch(err => {
    console.error('Erro de conexão:', err.message);
    process.exit(1);
  });
