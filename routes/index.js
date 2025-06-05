const express = require('express');
const router = express.Router();
const eventoRoutes = require('./eventoRoutes');

// Middleware para log
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Rota básica
router.get('/', (req, res) => {
  res.json({ message: 'API TickIN funcionando!' });
});

// Adicionar as rotas de eventos
router.use('/eventos', eventoRoutes);
console.log('Rotas de eventos registradas em /api/eventos');

// Rota de diagnóstico para o banco de dados
const pool = require('../config/database');
router.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    
    // Listar tabelas
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    
    res.status(200).json({ 
      status: 'Conexão com banco de dados OK', 
      timestamp: result.rows[0].now,
      tables: tables
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Erro na conexão com banco de dados', 
      error: error.message 
    });
  }
});

module.exports = router;
