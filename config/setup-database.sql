-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS tickin;
USE tickin;

-- Drop tables in reverse order to avoid foreign key conflicts
DROP TABLE IF EXISTS presencas;
DROP TABLE IF EXISTS lembretes;
DROP TABLE IF EXISTS inscricoes;
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS usuarios;

-- Create tables in order
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('cliente', 'organizador')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eventos (
  evento_id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  local VARCHAR(255) NOT NULL,
  capacidade INTEGER,
  organizador_id INTEGER REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inscricoes (
  inscricao_id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  evento_id INTEGER REFERENCES eventos(evento_id),
  status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS presencas (
  presenca_id SERIAL PRIMARY KEY,
  inscricao_id INTEGER REFERENCES inscricoes(inscricao_id),
  presente BOOLEAN DEFAULT false,
  horario_entrada TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lembretes (
  lembrete_id SERIAL PRIMARY KEY,
  evento_id INTEGER REFERENCES eventos(evento_id),
  mensagem TEXT NOT NULL,
  data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_eventos_organizador ON eventos(organizador_id);
CREATE INDEX idx_inscricoes_usuario ON inscricoes(usuario_id);
CREATE INDEX idx_inscricoes_evento ON inscricoes(evento_id);
CREATE INDEX idx_presencas_inscricao ON presencas(inscricao_id);
CREATE INDEX idx_lembretes_evento ON lembretes(evento_id); 