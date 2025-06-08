-- Primeiro, vamos renomear a coluna descricao para titulo
ALTER TABLE eventos RENAME COLUMN descricao TO titulo;

-- Agora vamos adicionar a nova coluna descricao
ALTER TABLE eventos ADD COLUMN descricao TEXT;

-- Atualizar a foreign key
DO $$ 
BEGIN
    -- Remover a foreign key antiga se existir
    ALTER TABLE eventos DROP CONSTRAINT IF EXISTS eventos_organizador_id_fkey;
    
    -- Renomear a coluna organizador_id para usuario_id se existir
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'eventos' 
        AND column_name = 'organizador_id'
    ) THEN
        ALTER TABLE eventos RENAME COLUMN organizador_id TO usuario_id;
    END IF;
    
    -- Adicionar a nova foreign key
    ALTER TABLE eventos 
    ADD CONSTRAINT eventos_usuario_id_fkey 
    FOREIGN KEY (usuario_id) 
    REFERENCES usuarios(id);
END $$;

-- Recriar os índices
DROP INDEX IF EXISTS idx_eventos_organizador;
CREATE INDEX idx_eventos_usuario ON eventos(usuario_id);
CREATE INDEX idx_eventos_data ON eventos(data); 