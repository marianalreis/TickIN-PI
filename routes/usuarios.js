// Rota para registro de usuário
router.post('/register', async (req, res) => {
  console.log('==== INÍCIO DO REGISTRO ====');
  console.log('Request body:', req.body);
  
  try {
    const { cpf, nome, email, endereco, telefone, password, userType } = req.body;
    
    console.log('1. Dados recebidos:', { 
      cpf, 
      nome, 
      email, 
      endereco, 
      telefone, 
      userType,
      temSenha: !!password 
    });

    // Validar dados obrigatórios
    if (!cpf || !nome || !email || !password || !userType) {
      console.log('2. ERRO: Campos obrigatórios faltando');
      return res.status(400).json({ 
        message: 'Todos os campos são obrigatórios'
      });
    }

    console.log('3. Validação de campos OK');

    // Hash da senha
    console.log('4. Iniciando hash da senha');
    let hashedPassword;
    try {
      const bcrypt = require('bcrypt');
      hashedPassword = await bcrypt.hash(password, 10);
      console.log('5. Senha hasheada com sucesso');
    } catch (hashError) {
      console.error('Erro ao hashear senha:', hashError);
      return res.status(500).json({ 
        message: 'Erro ao processar senha',
        error: hashError.message
      });
    }

    // Inserir usuário
    console.log('6. Tentando inserir usuário no banco');
    
    try {
      const pool = require('../config/database');
      
      // Verificar conexão com o banco
      console.log('6.1 Testando conexão com o banco');
      const testConn = await pool.query('SELECT NOW()');
      console.log('6.2 Conexão OK:', testConn.rows[0]);
      
      // Verificar se o usuário já existe
      console.log('7. Verificando se usuário já existe');
      const checkUser = await pool.query('SELECT * FROM usuarios WHERE CPF = $1 OR email = $2', [cpf, email]);
      
      if (checkUser.rows.length > 0) {
        console.log('7.1 Usuário já existe:', checkUser.rows[0]);
        return res.status(400).json({ 
          message: 'Usuário já cadastrado',
          error: 'CPF ou email já existe no sistema'
        });
      }

      console.log('8. Usuário não existe, prosseguindo com inserção');
      
      // Verificar estrutura da tabela
      console.log('8.1 Verificando estrutura da tabela usuarios');
      const tableInfo = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'usuarios'
      `);
      console.log('8.2 Estrutura da tabela:', tableInfo.rows);
      
      // Inserir usuário
      console.log('9. Executando query de inserção');
      const queryUsuario = `
        INSERT INTO usuarios (CPF, nome, email, endereco, telefone, senha) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *
      `;
      const valuesUsuario = [cpf, nome, email, endereco, telefone, hashedPassword];
      
      console.log('9.1 Query:', queryUsuario);
      console.log('9.2 Valores:', valuesUsuario.map((val, idx) => idx === 5 ? '[SENHA_HASHEADA]' : val));

      const resultUsuario = await pool.query(queryUsuario, valuesUsuario);
      console.log('10. Usuário inserido com sucesso:', resultUsuario.rows[0]);

      // Se for organizador, criar registro na tabela organizadores
      if (userType === 'organizador') {
        console.log('11. Criando registro de organizador');
        const queryOrg = 'INSERT INTO organizadores (nome, funcao, CPF) VALUES ($1, $2, $3) RETURNING *';
        const valuesOrg = [nome, 'Administrador', cpf];
        
        const resultOrg = await pool.query(queryOrg, valuesOrg);
        console.log('12. Organizador criado com sucesso:', resultOrg.rows[0]);
      }

      console.log('==== REGISTRO CONCLUÍDO COM SUCESSO ====');
      return res.status(201).json({ 
        message: 'Usuário registrado com sucesso',
        user: {
          cpf: resultUsuario.rows[0].cpf,
          nome: resultUsuario.rows[0].nome,
          email: resultUsuario.rows[0].email
        },
        redirect: '/login'
      });

    } catch (dbError) {
      console.error('==== ERRO AO EXECUTAR QUERY ====');
      console.error('Erro completo:', dbError);
      console.error('Detalhes do erro:', {
        message: dbError.message,
        code: dbError.code,
        constraint: dbError.constraint,
        detail: dbError.detail,
        schema: dbError.schema,
        table: dbError.table,
        column: dbError.column
      });
      
      return res.status(500).json({ 
        message: 'Erro ao registrar usuário',
        error: dbError.detail || dbError.message
      });
    }

  } catch (error) {
    console.error('==== ERRO GERAL NO REGISTRO ====');
    console.error('Erro completo:', error);
    console.error('Stack trace:', error.stack);
    return res.status(500).json({ 
      message: 'Erro interno ao registrar usuário',
      error: error.message
    });
  }
});