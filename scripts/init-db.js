const pool = require('../config/database');

async function initDatabase() {
  console.log('Iniciando configuração do banco de dados...');
  
  try {
    // Verificar se a tabela de usuários existe
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'usuarios'
      );
    `);
    
    const tableExists = checkTable.rows[0].exists;
    console.log('Tabela de usuários existe?', tableExists);
    
    if (!tableExists) {
      console.log('Criando tabela de usuários...');
      
      await pool.query(`
        CREATE TABLE usuarios (
          CPF VARCHAR(11) PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          endereco VARCHAR(200),
          telefone VARCHAR(20),
          senha VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('Tabela de usuários criada com sucesso!');
    }
    
    // Verificar se a tabela de organizadores existe
    const checkOrgTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'organizadores'
      );
    `);
    
    const orgTableExists = checkOrgTable.rows[0].exists;
    console.log('Tabela de organizadores existe?', orgTableExists);
    
    if (!orgTableExists) {
      console.log('Criando tabela de organizadores...');
      
      await pool.query(`
        CREATE TABLE organizadores (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          funcao VARCHAR(100),
          CPF VARCHAR(11) REFERENCES usuarios(CPF),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('Tabela de organizadores criada com sucesso!');
    }
    
    console.log('Configuração do banco de dados concluída!');
    
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
  } finally {
    // Fechar pool de conexões
    pool.end();
  }
}

// Executar a função
initDatabase();