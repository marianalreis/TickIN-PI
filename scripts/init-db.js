const pool = require('../config/database');

async function initDatabase() {
  try {
    console.log('Iniciando configuração do banco de dados...');

    // Drop and recreate usuarios table
    await pool.query(`
      DROP TABLE IF EXISTS usuarios CASCADE;
      
      CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        senha VARCHAR(255) NOT NULL,
        tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('cliente', 'organizador')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
      CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);
    `);

    console.log('Tabela usuarios criada com sucesso!');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
    process.exit(1);
  }
}

initDatabase();