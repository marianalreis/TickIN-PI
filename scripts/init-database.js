const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  console.log('Iniciando configuração do banco de dados...');
  
  // Configuração da conexão com o banco de dados postgres
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', // Conectar ao banco postgres para poder criar o banco tickin
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false
  });
  
  try {
    // Verificar se o banco de dados tickin existe
    const dbCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM pg_database WHERE datname = 'tickin'
      );
    `);
    
    const dbExists = dbCheckResult.rows[0].exists;
    console.log('Banco de dados tickin existe?', dbExists);
    
    // Se o banco não existir, criar
    if (!dbExists) {
      console.log('Criando banco de dados tickin...');
      await pool.query('CREATE DATABASE tickin');
      console.log('Banco de dados tickin criado com sucesso!');
    }
    
    // Fechar conexão com postgres
    await pool.end();
    
    // Conectar ao banco tickin
    const tickinPool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: 'tickin',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
      } : false
    });
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '..', 'config', 'setup-database.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir o script em comandos individuais
    const commands = sqlScript
      .replace(/\\c\s+[^;]+;/g, '') // Remover comandos \c que não funcionam com node-postgres
      .split(';')
      .filter(cmd => cmd.trim() !== '');
    
    // Executar cada comando
    for (const command of commands) {
      try {
        await tickinPool.query(command);
      } catch (err) {
        console.error('Erro ao executar comando:', command);
        console.error('Detalhes do erro:', err.message);
        // Continuar mesmo com erro
      }
    }
    
    console.log('Script SQL executado com sucesso!');
    
    // Verificar se as tabelas foram criadas
    const tablesResult = await tickinPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tabelas criadas:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Fechar conexão
    await tickinPool.end();
    
    console.log('Configuração do banco de dados concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
  }
}

// Executar a função
initDatabase();