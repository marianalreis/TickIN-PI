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

async function addTestUser() {
  console.log('Adicionando usuário de teste...');
  
  try {
    // Verificar se o usuário já existe
    const checkResult = await pool.query('SELECT * FROM usuarios WHERE email = $1', ['teste@email.com']);
    
    if (checkResult.rows.length > 0) {
      console.log('Usuário de teste já existe.');
      return;
    }
    
    // Adicionar usuário de teste
    const insertResult = await pool.query(`
      INSERT INTO usuarios (cpf, nome, email, endereco, telefone, senha)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, ['12345678901', 'Usuário Teste', 'teste@email.com', 'Rua Teste, 123', '11987654321', 'senha123']);
    
    console.log('Usuário de teste adicionado com sucesso:', insertResult.rows[0]);
  } catch (error) {
    console.error('❌ Erro ao adicionar usuário de teste:', error);
  } finally {
    pool.end();
  }
}

addTestUser();