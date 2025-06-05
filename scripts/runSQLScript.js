const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

const runSQLScript = async () => {
  try {
    console.log('Inicializando banco de dados...');
    
    // Verificar se a tabela users existe
    const usersTableExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'users'
      ) as exists
    `);
    
    if (!usersTableExists.rows[0].exists) {
      console.log('Tabela users não encontrada, criando...');
      
      // Criar a extensão uuid-ossp se não existir
      await pool.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
      `);
      
      // Criar a tabela users
      await pool.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL
        )
      `);
      
      console.log('Tabela users criada com sucesso!');
      
      // Inserir usuários de exemplo usando DO para evitar duplicações
      await pool.query(`
        DO $$
        BEGIN
          -- Alice Smith
          IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'alice.smith@example.com') THEN
            INSERT INTO users (name, email) VALUES ('Alice Smith', 'alice.smith@example.com');
          END IF;
          
          -- Bob Johnson
          IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'bob.johnson@example.com') THEN
            INSERT INTO users (name, email) VALUES ('Bob Johnson', 'bob.johnson@example.com');
          END IF;
          
          -- Carol Williams
          IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'carol.williams@example.com') THEN
            INSERT INTO users (name, email) VALUES ('Carol Williams', 'carol.williams@example.com');
          END IF;
        END $$;
      `);
      
      console.log('Usuários de exemplo inseridos com sucesso!');
    } else {
      console.log('Tabela users já existe, pulando criação...');
    }
    
    // Verificar se a tabela eventos existe
    const eventosTableExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'eventos'
      ) as exists
    `);
    
    if (!eventosTableExists.rows[0].exists) {
      console.log('Tabela eventos não encontrada, criando...');
      
      // Criar a tabela eventos com SERIAL para auto-incremento
      await pool.query(`
        DROP TABLE IF EXISTS eventos;
        CREATE TABLE eventos (
          evento_id SERIAL PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          descricao TEXT,
          data DATE NOT NULL,
          hora TIME NOT NULL,
          local VARCHAR(255) NOT NULL,
          capacidade INTEGER,
          valor NUMERIC DEFAULT 0
        )
      `);
      
      console.log('Tabela eventos criada com sucesso!');
      
      // Inserir eventos de exemplo usando DO para evitar duplicações
      await pool.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo = 'Workshop de Programação' AND data = '2023-12-15') THEN
            INSERT INTO eventos (titulo, descricao, data, hora, local, capacidade, valor) 
            VALUES ('Workshop de Programação', 'Aprenda a programar em JavaScript', '2023-12-15', '14:00:00', 'Sala 302, Bloco B', 30, 50.00);
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo = 'Palestra sobre IA' AND data = '2023-12-20') THEN
            INSERT INTO eventos (titulo, descricao, data, hora, local, capacidade, valor) 
            VALUES ('Palestra sobre IA', 'Inteligência Artificial e o futuro da tecnologia', '2023-12-20', '18:30:00', 'Auditório Principal', 100, 0.00);
          END IF;
        END $$;
      `);
      
      console.log('Eventos de exemplo inseridos com sucesso!');
    } else {
      console.log('Tabela eventos já existe, verificando estrutura...');
      
      // Verificar se a coluna evento_id tem um valor padrão
      const columnInfo = await pool.query(`
        SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'eventos' AND column_name = 'evento_id'
      `);
      
      if (columnInfo.rows.length > 0 && !columnInfo.rows[0].column_default) {
        console.log('Coluna evento_id não tem valor padrão, adicionando...');
        
        // Criar uma sequência para evento_id
        await pool.query(`
          CREATE SEQUENCE IF NOT EXISTS eventos_evento_id_seq
        `);
        
        // Definir a sequência como valor padrão para evento_id
        await pool.query(`
          ALTER TABLE eventos 
          ALTER COLUMN evento_id SET DEFAULT nextval('eventos_evento_id_seq')
        `);
        
        // Definir a sequência para começar após o maior valor atual
        await pool.query(`
          SELECT setval('eventos_evento_id_seq', COALESCE((SELECT MAX(evento_id) FROM eventos), 0) + 1, false)
        `);
        
        console.log('Valor padrão adicionado à coluna evento_id com sucesso!');
      } else {
        console.log('Coluna evento_id já tem um valor padrão');
      }
      
      // Verificar se existem as colunas necessárias
      const columnsResult = await pool.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'eventos'
      `);
      
      const columns = columnsResult.rows.map(row => row.column_name);
      
      if (!columns.includes('titulo')) {
        console.log('Adicionando coluna titulo...');
        await pool.query(`ALTER TABLE eventos ADD COLUMN titulo VARCHAR(255) NOT NULL DEFAULT 'Evento sem título'`);
      }
      
      if (!columns.includes('capacidade')) {
        console.log('Adicionando coluna capacidade...');
        await pool.query(`ALTER TABLE eventos ADD COLUMN capacidade INTEGER`);
      }
      
      if (!columns.includes('hora') && columns.includes('horario')) {
        console.log('Renomeando coluna horario para hora...');
        await pool.query(`ALTER TABLE eventos RENAME COLUMN horario TO hora`);
      } else if (!columns.includes('hora') && !columns.includes('horario')) {
        console.log('Adicionando coluna hora...');
        await pool.query(`ALTER TABLE eventos ADD COLUMN hora TIME`);
      }
    }
    
    console.log('\nBanco de dados inicializado com sucesso!');
  } catch (err) {
    console.error('Erro ao inicializar o banco de dados:', err);
  } finally {
    await pool.end();
  }
};

runSQLScript();
