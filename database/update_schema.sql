-- Verificar se a coluna id existe e renomear para inscricao_id
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'inscricoes'
        AND column_name = 'id'
    ) THEN
        ALTER TABLE inscricoes RENAME COLUMN id TO inscricao_id;
    END IF;
END $$;

-- Caso a tabela não exista, criar com a estrutura correta
CREATE TABLE IF NOT EXISTS inscricoes (
    inscricao_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    evento_id INTEGER NOT NULL REFERENCES eventos(evento_id),
    status VARCHAR(50) NOT NULL DEFAULT 'Pendente',
    data_inscricao DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(usuario_id, evento_id)
); 