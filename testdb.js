const { Pool } = require('pg');
require('dotenv').config();

// Criar uma nova instância do pool
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

async function testDatabase() {
  console.log('Testando conexão com o banco de dados...');
  
  try {
    // Testar conexão
    const connResult = await pool.query('SELECT NOW()');
    console.log('Conexão OK:', connResult.rows[0].now);
    
    // Verificar tabela de usuários
    const tableResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'usuarios'
      );
    `);
    console.log('Tabela usuarios existe?', tableResult.rows[0].exists);
    
    if (tableResult.rows[0].exists) {
      // Listar estrutura da tabela
      const columnsResult = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'usuarios'
      `);
      console.log('Estrutura da tabela usuarios:');
      columnsResult.rows.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type})`);
      });
      
      // Contar usuários
      const countResult = await pool.query('SELECT COUNT(*) FROM usuarios');
      console.log('Total de usuários:', countResult.rows[0].count);
      
      // Listar usuários (limitado a 5)
      const usersResult = await pool.query('SELECT * FROM usuarios LIMIT 5');
      console.log('Usuários cadastrados:');
      usersResult.rows.forEach(user => {
        console.log(`- ${user.nome} (${user.email})`);
      });
    }
    
    console.log('Teste concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  } finally {
    pool.end();
  }
}

testDatabase();
