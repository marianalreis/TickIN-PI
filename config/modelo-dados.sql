-- Drop tables in reverse order to avoid foreign key conflicts
DROP TABLE IF EXISTS presencas CASCADE;
DROP TABLE IF EXISTS lembretes CASCADE;
DROP TABLE IF EXISTS inscricoes CASCADE;
DROP TABLE IF EXISTS eventos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Create tables in order
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
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
  imagem VARCHAR(255),
  usuario_id INTEGER REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inscricoes (
  inscricao_id SERIAL PRIMARY KEY,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  usuario_id INTEGER REFERENCES usuarios(id),
  evento_id INTEGER REFERENCES eventos(evento_id)
);

CREATE TABLE IF NOT EXISTS lembretes (
  lembrete_id SERIAL PRIMARY KEY,
  mensagem TEXT NOT NULL,
  data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  evento_id INTEGER REFERENCES eventos(evento_id)
);

CREATE TABLE IF NOT EXISTS presencas (
  presenca_id SERIAL PRIMARY KEY,
  presente BOOLEAN DEFAULT false,
  horario_entrada TIMESTAMP,
  inscricao_id INTEGER REFERENCES inscricoes(inscricao_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX idx_eventos_usuario ON eventos(usuario_id);
CREATE INDEX idx_inscricoes_usuario ON inscricoes(usuario_id);
CREATE INDEX idx_inscricoes_evento ON inscricoes(evento_id);
CREATE INDEX idx_presencas_inscricao ON presencas(inscricao_id);
CREATE INDEX idx_lembretes_evento ON lembretes(evento_id);

-- Insert test data
INSERT INTO usuarios (CPF, nome, email, senha) 
VALUES ('12345678900', 'Usuário Teste', 'teste@teste.com', 'senha123')
ON CONFLICT (CPF) DO NOTHING;

INSERT INTO organizadores (nome, funcao, CPF) 
VALUES ('Organizador Teste', 'Administrador', '12345678900')
ON CONFLICT DO NOTHING;
