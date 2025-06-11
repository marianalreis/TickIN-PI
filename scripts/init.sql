-- init.sql

-- Drop existing tables in reverse order to avoid foreign key constraints
DROP TABLE IF EXISTS eventos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP EXTENSION IF EXISTS "uuid-ossp";

-- Create usuarios table
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('cliente', 'organizador')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Create eventos table
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

-- Create indexes for better performance
CREATE INDEX idx_eventos_usuario ON eventos(usuario_id);
CREATE INDEX idx_eventos_data ON eventos(data);

-- Insert a test organizer user (password: 123456)
INSERT INTO usuarios (nome, email, telefone, senha, tipo_usuario)
VALUES (
    'Organizador Teste',
    'organizador@teste.com',
    '11999999999',
    '$2b$10$5YZ9jBL.V.R.zHX4pF3ZB.zHgZy6N.PPuFZ9QEtGG.JM1ZxP5Vq6e',
    'organizador'
);
