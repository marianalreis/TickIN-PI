-- Verificar se as tabelas existem
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'eventos'
);

SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'usuarios'
);

-- Mostrar estrutura da tabela eventos
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'eventos'; 