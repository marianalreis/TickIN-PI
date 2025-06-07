const { Pool } = require('pg');
require('dotenv').config();

// Criar uma nova instância do pool
const pool = new Pool({
  connectionString: `postgres://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: {
    rejectUnauthorized: false
  }
});

async function addTestUsers() {
  console.log('Adicionando usuários de teste...');
  
  try {
    // 1. Adicionar usuário cliente
    console.log('Verificando se o usuário cliente já existe...');
    const checkCliente = await pool.query('SELECT * FROM usuarios WHERE email = $1', ['cliente@test.com']);
    
    if (checkCliente.rows.length === 0) {
      console.log('Adicionando usuário cliente...');
      const clienteResult = await pool.query(`
        INSERT INTO usuarios (cpf, nome, email, endereco, telefone, senha)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, ['11122233344', 'Cliente Teste', 'cliente@test.com', 'Rua Cliente, 123', '11987654321', 'cliente123']);
      
      console.log('Usuário cliente adicionado:', {
        cpf: clienteResult.rows[0].cpf,
        nome: clienteResult.rows[0].nome,
        email: clienteResult.rows[0].email
      });
    } else {
      console.log('Usuário cliente já existe. Atualizando senha...');
      await pool.query('UPDATE usuarios SET senha = $1 WHERE email = $2', ['cliente123', 'cliente@test.com']);
    }
    
    // 2. Adicionar usuário organizador
    console.log('Verificando se o usuário organizador já existe...');
    const checkOrg = await pool.query('SELECT * FROM usuarios WHERE email = $1', ['org@test.com']);
    
    if (checkOrg.rows.length === 0) {
      console.log('Adicionando usuário organizador...');
      const orgResult = await pool.query(`
        INSERT INTO usuarios (cpf, nome, email, endereco, telefone, senha)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, ['99988877766', 'Organizador Teste', 'org@test.com', 'Rua Organizador, 456', '11912345678', 'org123']);
      
      console.log('Usuário organizador adicionado:', {
        cpf: orgResult.rows[0].cpf,
        nome: orgResult.rows[0].nome,
        email: orgResult.rows[0].email
      });
      
      // Adicionar na tabela de organizadores
      console.log('Adicionando registro na tabela organizadores...');
      try {
        const orgTableResult = await pool.query(`
          INSERT INTO organizadores (cpf, nome, funcao)
          VALUES ($1, $2, $3)
          RETURNING *
        `, ['99988877766', 'Organizador Teste', 'Administrador']);
        
        console.log('Registro de organizador adicionado com sucesso');
      } catch (orgError) {
        console.error('Erro ao adicionar registro na tabela organizadores:', orgError);
        console.log('Verificando estrutura da tabela organizadores...');
        
        const orgTableInfo = await pool.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'organizadores'
        `);
        
        console.log('Estrutura da tabela organizadores:', orgTableInfo.rows);
      }
    } else {
      console.log('Usuário organizador já existe. Atualizando senha...');
      await pool.query('UPDATE usuarios SET senha = $1 WHERE email = $2', ['org123', 'org@test.com']);
      
      // Verificar se existe na tabela de organizadores
      const checkOrgTable = await pool.query('SELECT * FROM organizadores WHERE cpf = $1', ['99988877766']);
      
      if (checkOrgTable.rows.length === 0) {
        console.log('Adicionando registro na tabela organizadores...');
        await pool.query(`
          INSERT INTO organizadores (cpf, nome, funcao)
          VALUES ($1, $2, $3)
        `, ['99988877766', 'Organizador Teste', 'Administrador']);
      }
    }
    
    console.log('Usuários de teste adicionados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao adicionar usuários de teste:', error);
  } finally {
    await pool.end();
  }
}

addTestUsers();