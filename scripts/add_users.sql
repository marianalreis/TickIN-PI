-- Adicionar usuários de teste
INSERT INTO usuarios (nome, email, telefone, senha, tipo_usuario)
VALUES 
    -- Ronaldo (senha: 123456)
    ('Ronaldo Willian Reis', 'rwreis@gmail.com', '11999999999',
    '$2b$10$5YZ9jBL.V.R.zHX4pF3ZB.zHgZy6N.PPuFZ9QEtGG.JM1ZxP5Vq6e', 'organizador'),
    
    -- Outros usuários de teste (senha: 123456 para todos)
    ('Cliente Teste', 'cliente@teste.com', '11988888888',
    '$2b$10$5YZ9jBL.V.R.zHX4pF3ZB.zHgZy6N.PPuFZ9QEtGG.JM1ZxP5Vq6e', 'cliente'),
    
    ('Organizador 2', 'org2@teste.com', '11977777777',
    '$2b$10$5YZ9jBL.V.R.zHX4pF3ZB.zHgZy6N.PPuFZ9QEtGG.JM1ZxP5Vq6e', 'organizador');

-- A senha '123456' foi hasheada com bcrypt e o resultado é o hash acima
-- Você pode usar essas credenciais para testar:
-- Email: rwreis@gmail.com, senha: 123456
-- Email: cliente@teste.com, senha: 123456
-- Email: org2@teste.com, senha: 123456 