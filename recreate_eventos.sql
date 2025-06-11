-- Dropar a tabela eventos
DROP TABLE IF EXISTS eventos CASCADE;

-- Criar a tabela eventos com a estrutura correta
CREATE TABLE eventos (
    evento_ID SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    local VARCHAR(255) NOT NULL,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX idx_eventos_usuario ON eventos(usuario_id);
CREATE INDEX idx_eventos_data ON eventos(data); 