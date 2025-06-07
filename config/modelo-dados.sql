-- Drop tables in reverse order to avoid foreign key conflicts
DROP TABLE IF EXISTS presencas CASCADE;
DROP TABLE IF EXISTS lembretes CASCADE;
DROP TABLE IF EXISTS inscricoes CASCADE;
DROP TABLE IF EXISTS organizadores CASCADE;
DROP TABLE IF EXISTS eventos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Create tables in order
CREATE TABLE IF NOT EXISTS usuarios (
  CPF varchar(255) PRIMARY KEY,
  nome varchar(255),
  email varchar(255),
  endereco varchar(255),
  telefone varchar(255),
  senha varchar(255)
);

CREATE TABLE IF NOT EXISTS organizadores (
  organizador_ID SERIAL PRIMARY KEY,
  nome varchar(255),
  colaboradores varchar(255),
  funcao varchar(255),
  CPF varchar(255) REFERENCES usuarios(CPF)
);

CREATE TABLE IF NOT EXISTS eventos (
  evento_ID SERIAL PRIMARY KEY,
  data date,
  descricao varchar(255),
  valor decimal(10,2),
  local varchar(255),
  horario time,
  organizador_ID integer REFERENCES organizadores(organizador_ID)
);

-- Add evento_ID to organizadores after eventos table exists
ALTER TABLE organizadores 
  ADD COLUMN evento_ID integer REFERENCES eventos(evento_ID);

CREATE TABLE IF NOT EXISTS inscricoes (
  compra_ID SERIAL PRIMARY KEY,
  status varchar(255),
  data_inscricao date DEFAULT CURRENT_DATE,
  CPF varchar(255) REFERENCES usuarios(CPF),
  evento_ID integer REFERENCES eventos(evento_ID)
);

CREATE TABLE IF NOT EXISTS lembretes (
  mensagem_ID SERIAL PRIMARY KEY,
  mensagem text,
  CPF varchar(255) REFERENCES usuarios(CPF),
  evento_ID integer REFERENCES eventos(evento_ID)
);

CREATE TABLE IF NOT EXISTS presencas (
  presenca_ID SERIAL PRIMARY KEY,
  presente boolean,
  horario_entrada time,
  compra_ID integer REFERENCES inscricoes(compra_ID)
);

-- Insert test data
INSERT INTO usuarios (CPF, nome, email, senha) 
VALUES ('12345678900', 'Usuário Teste', 'teste@teste.com', 'senha123')
ON CONFLICT (CPF) DO NOTHING;

INSERT INTO organizadores (nome, funcao, CPF) 
VALUES ('Organizador Teste', 'Administrador', '12345678900')
ON CONFLICT DO NOTHING;
