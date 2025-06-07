const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDB() {
  const pool = require('./database');
  
  try {
    console.log('Iniciando configuração do banco de dados...');

    // Testar conexão
    await pool.query('SELECT 1');
    console.log('✅ Conexão com o banco de dados estabelecida!');

    // Ler e executar o script SQL
    const sqlScript = fs.readFileSync(path.join(__dirname, 'modelo-dados.sql'), 'utf8');
    await pool.query(sqlScript);
    console.log('✅ Tabelas criadas com sucesso!');

    // Inserir dados de teste
    const organizador = {
      nome: 'Organizador Teste',
      colaboradores: 'Equipe Teste',
      funcao: 'Administrador',
      CPF: '12345678900'
    };

    // Inserir organizador
    const orgResult = await pool.query(
      'INSERT INTO organizadores (nome, colaboradores, funcao, CPF) VALUES ($1, $2, $3, $4) RETURNING organizador_ID',
      [organizador.nome, organizador.colaboradores, organizador.funcao, organizador.CPF]
    );

    const organizadorId = orgResult.rows[0].organizador_id;
    console.log('✅ Organizador de teste criado com ID:', organizadorId);

    // Inserir evento de teste
    const evento = {
      data: new Date(),
      descricao: 'Evento Teste\nDescrição detalhada do evento teste',
      valor: 50.00,
      local: 'Local Teste',
      horario: '14:00',
      organizador_ID: organizadorId
    };

    await pool.query(
      'INSERT INTO eventos (data, descricao, valor, local, horario, organizador_ID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING evento_ID',
      [evento.data, evento.descricao, evento.valor, evento.local, evento.horario, evento.organizador_ID]
    );

    console.log('✅ Evento de teste criado com sucesso!');
    console.log('\n🎉 Banco de dados inicializado com sucesso!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a inicialização do banco de dados:', error);
    process.exit(1);
  }
}

initDB(); 