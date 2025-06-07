const { Pool } = require('pg');
require('dotenv').config();

// Mostrar as variáveis de ambiente (sem a senha)
console.log('Variáveis de ambiente:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[DEFINIDO]' : '[NÃO DEFINIDO]');

// Criar uma nova instância do pool
const pool = new Pool({
  connectionString: `postgres://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: {
    rejectUnauthorized: false
  }
});

async function diagnoseDatabase() {
  console.log('Iniciando diagnóstico do banco de dados...');
  
  try {
    console.log('1. Testando conexão...');
    const client = await pool.connect();
    console.log('   ✓ Conexão estabelecida com sucesso');
    
    console.log('2. Verificando versão do PostgreSQL...');
    const versionResult = await client.query('SELECT version()');
    console.log(`   ✓ Versão: ${versionResult.rows[0].version}`);
    
    console.log('3. Verificando tabelas existentes...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('   ✗ Nenhuma tabela encontrada no esquema public');
    } else {
      console.log(`   ✓ Tabelas encontradas: ${tablesResult.rows.length}`);
      tablesResult.rows.forEach(row => {
        console.log(`     - ${row.table_name}`);
      });
    }
    
    console.log('4. Verificando tabela usuarios...');
    const usuariosResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      );
    `);
    
    if (usuariosResult.rows[0].exists) {
      console.log('   ✓ Tabela usuarios existe');
      
      console.log('5. Verificando estrutura da tabela usuarios...');
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'usuarios'
        ORDER BY ordinal_position;
      `);
      
      console.log('   Colunas da tabela usuarios:');
      columnsResult.rows.forEach(col => {
        console.log(`     - ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      
      console.log('6. Contando registros na tabela usuarios...');
      const countResult = await client.query('SELECT COUNT(*) FROM usuarios');
      console.log(`   ✓ Total de registros: ${countResult.rows[0].count}`);
      
      if (parseInt(countResult.rows[0].count) > 0) {
        console.log('7. Listando alguns usuários (sem mostrar senhas)...');
        const usersResult = await client.query(`
          SELECT cpf, nome, email, endereco, telefone, 
                 CASE WHEN senha IS NOT NULL THEN '[SENHA DEFINIDA]' ELSE '[SEM SENHA]' END as senha_status
          FROM usuarios 
          LIMIT 3
        `);
        
        usersResult.rows.forEach((user, index) => {
          console.log(`   Usuário ${index + 1}:`);
          console.log(`     - CPF: ${user.cpf}`);
          console.log(`     - Nome: ${user.nome}`);
          console.log(`     - Email: ${user.email}`);
          console.log(`     - Senha: ${user.senha_status}`);
        });
      }
    } else {
      console.log('   ✗ Tabela usuarios não existe');
    }
    
    client.release();
    console.log('Diagnóstico concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o diagnóstico:', error);
  } finally {
    await pool.end();
  }
}

diagnoseDatabase();