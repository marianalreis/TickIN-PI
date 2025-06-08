-- Dropar tabelas existentes em ordem reversa para evitar problemas com foreign keys
DROP TABLE IF EXISTS eventos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP EXTENSION IF EXISTS "uuid-ossp";

-- Criar a tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('cliente', 'organizador')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Criar a tabela de eventos
CREATE TABLE eventos (
    evento_id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    local VARCHAR(255) NOT NULL,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_eventos_usuario ON eventos(usuario_id);
CREATE INDEX idx_eventos_data ON eventos(data);

-- Inserir um usuário organizador para teste (senha: 123456)
INSERT INTO usuarios (nome, email, telefone, senha, tipo_usuario)
VALUES (
    'Organizador Teste',
    'organizador@teste.com',
    '11999999999',
    '$2b$10$5YZ9jBL.V.R.zHX4pF3ZB.zHgZy6N.PPuFZ9QEtGG.JM1ZxP5Vq6e',
    'organizador'
); 