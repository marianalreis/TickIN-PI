-- Primeiro, vamos renomear a coluna compra_id para id
ALTER TABLE inscricoes RENAME COLUMN compra_id TO id;

-- Adicionar a coluna usuario_id
ALTER TABLE inscricoes ADD COLUMN usuario_id INTEGER;

-- Preencher usuario_id baseado no CPF (se necessário)
UPDATE inscricoes i
SET usuario_id = u.id
FROM usuarios u
WHERE i.cpf = u.cpf;

-- Tornar usuario_id NOT NULL após a migração
ALTER TABLE inscricoes ALTER COLUMN usuario_id SET NOT NULL;

-- Adicionar chaves estrangeiras
ALTER TABLE inscricoes
ADD CONSTRAINT fk_inscricoes_usuario
FOREIGN KEY (usuario_id) REFERENCES usuarios(id);

ALTER TABLE inscricoes
ADD CONSTRAINT fk_inscricoes_evento
FOREIGN KEY (evento_id) REFERENCES eventos(evento_id);

-- Adicionar índices para melhor performance
CREATE INDEX idx_inscricoes_usuario_id ON inscricoes(usuario_id);
CREATE INDEX idx_inscricoes_evento_id ON inscricoes(evento_id);

-- Atualizar a coluna status para ter valores padrão
ALTER TABLE inscricoes 
ALTER COLUMN status SET DEFAULT 'Pendente',
ALTER COLUMN status SET NOT NULL; 