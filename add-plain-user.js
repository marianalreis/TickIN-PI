const { Pool } = require('pg');
require('dotenv').config();

// Criar uma nova instância do pool
const pool = new Pool({
  connectionString: `postgres://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: {
    rejectUnauthorized: false
  }
});

async function addPlainUser() {
  console.log('Adicionando usuário com senha em texto puro (apenas para teste)...');
  
  try {
    // Verificar se o usuário já existe
    const checkResult = await pool.query('SELECT * FROM usuarios WHERE email = $1', ['plain@test.com']);
    
    if (checkResult.rows.length > 0) {
      console.log('Usuário de teste já existe. Atualizando senha...');
      await pool.query('UPDATE usuarios SET senha = $1 WHERE email = $2', ['123456', 'plain@test.com']);
      console.log('Senha atualizada com sucesso!');
    } else {
      // Adicionar usuário de teste com senha em texto puro
      const insertResult = await pool.query(`
        INSERT INTO usuarios (cpf, nome, email, endereco, telefone, senha)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, ['98765432100', 'Usuário Teste Simples', 'plain@test.com', 'Rua Teste, 456', '11912345678', '123456']);
      
      console.log('Usuário de teste adicionado com sucesso:', {
        cpf: insertResult.rows[0].cpf,
        nome: insertResult.rows[0].nome,
        email: insertResult.rows[0].email,
        senha: '123456' // Mostrando a senha apenas para fins de teste
      });
    }
  } catch (error) {
    console.error('❌ Erro ao adicionar usuário de teste:', error);
  } finally {
    await pool.end();
  }
}

addPlainUser();