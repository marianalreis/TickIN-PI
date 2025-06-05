-- init.sql

-- Criar extensão para suportar UUIDs, se ainda não estiver ativada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de usuários com UUID como chave primária (se não existir)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- Inserir usuários apenas se não existirem
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
  
  -- David Jones
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'david.jones@example.com') THEN
    INSERT INTO users (name, email) VALUES ('David Jones', 'david.jones@example.com');
  END IF;
  
  -- Emma Brown
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'emma.brown@example.com') THEN
    INSERT INTO users (name, email) VALUES ('Emma Brown', 'emma.brown@example.com');
  END IF;
END $$;

-- Criar ou modificar a tabela de eventos
DO $$
BEGIN
  -- Verificar se a tabela eventos existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'eventos') THEN
    -- Verificar se a coluna evento_id tem um valor padrão
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'eventos' 
      AND column_name = 'evento_id' 
      AND column_default IS NOT NULL
    ) THEN
      -- Criar uma sequência para evento_id se não existir
      IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'eventos_evento_id_seq') THEN
        CREATE SEQUENCE eventos_evento_id_seq;
      END IF;
      
      -- Definir a sequência como valor padrão para evento_id
      ALTER TABLE eventos 
      ALTER COLUMN evento_id SET DEFAULT nextval('eventos_evento_id_seq');
      
      -- Definir a sequência para começar após o maior valor atual
      PERFORM setval('eventos_evento_id_seq', COALESCE((SELECT MAX(evento_id) FROM eventos), 0) + 1, false);
    END IF;
  ELSE
    -- Criar a tabela eventos se não existir
    CREATE TABLE eventos (
      evento_id SERIAL PRIMARY KEY,
      descricao VARCHAR(255),
      data DATE,
      valor NUMERIC,
      local VARCHAR(255),
      horario TIME,
      organizador_id INTEGER
    );
  END IF;
END $$;

-- Inserir alguns eventos de exemplo apenas se não existirem
INSERT INTO eventos (descricao, data, valor, local, horario)
SELECT 
  'Workshop de Programação', 
  '2023-12-15', 
  50.00,
  'Sala 302, Bloco B', 
  '14:00:00'
WHERE NOT EXISTS (
  SELECT 1 FROM eventos 
  WHERE descricao = 'Workshop de Programação' 
  AND data = '2023-12-15'
);

INSERT INTO eventos (descricao, data, valor, local, horario)
SELECT 
  'Palestra sobre IA', 
  '2023-12-20', 
  0.00,
  'Auditório Principal', 
  '18:30:00'
WHERE NOT EXISTS (
  SELECT 1 FROM eventos 
  WHERE descricao = 'Palestra sobre IA' 
  AND data = '2023-12-20'
);
