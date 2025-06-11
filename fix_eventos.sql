-- Criar uma tabela temporária para backup
CREATE TABLE eventos_backup AS SELECT * FROM eventos;

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
    usuario_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar a foreign key
ALTER TABLE eventos
    ADD CONSTRAINT eventos_usuario_id_fkey
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id);

-- Criar índices
CREATE INDEX idx_eventos_usuario ON eventos(usuario_id);
CREATE INDEX idx_eventos_data ON eventos(data);

-- Tentar migrar dados da tabela de backup (se existirem)
DO $$
BEGIN
    -- Verificar se a tabela de backup existe e tem dados
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'eventos_backup'
    ) THEN
        -- Se a coluna antiga era 'descricao', usar como título
        IF EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'eventos_backup' 
            AND column_name = 'descricao'
        ) THEN
            INSERT INTO eventos (titulo, data, horario, local, usuario_id, created_at)
            SELECT descricao, data, horario, local, 
                   CASE 
                       WHEN organizador_id IS NOT NULL THEN organizador_id 
                       WHEN usuario_id IS NOT NULL THEN usuario_id
                   END,
                   created_at
            FROM eventos_backup;
        END IF;
    END IF;
END $$;

-- Dropar a tabela de backup
DROP TABLE IF EXISTS eventos_backup; 