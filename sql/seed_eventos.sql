-- Inserir dados de teste na tabela eventos
INSERT INTO eventos (titulo, descricao, data, horario, local, usuario_id, imagem)
VALUES 
    ('Workshop de JavaScript', 
     'Aprenda os fundamentos de JavaScript com exemplos práticos', 
     CURRENT_DATE + INTERVAL '7 days', 
     '14:00', 
     'Sala 301', 
     1, -- Certifique-se de que este usuário existe
     '/assets/workshop-js.png'),
    
    ('Hackathon IA', 
     'Desenvolva soluções inovadoras usando Inteligência Artificial', 
     CURRENT_DATE + INTERVAL '14 days', 
     '09:00', 
     'Auditório Principal', 
     1, -- Certifique-se de que este usuário existe
     '/assets/hackathon.png'),
    
    ('Meetup de Python', 
     'Encontro da comunidade Python para discutir as últimas novidades', 
     CURRENT_DATE + INTERVAL '5 days', 
     '19:00', 
     'Sala de Conferências', 
     1, -- Certifique-se de que este usuário existe
     '/assets/python-meetup.png');

-- Verificar se os dados foram inseridos
SELECT id, titulo, data, horario, local FROM eventos; 