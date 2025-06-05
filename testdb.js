const pool = require('./config/database');
const fs = require('fs');
const path = require('path');

async function testConnection() {
    try {
        // Teste de conexão
        const client = await pool.connect();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');

        // Ler e executar o script SQL
        const sqlScript = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
        await client.query(sqlScript);
        console.log('✅ Tabela de usuários criada/verificada com sucesso!');

        // Testar inserção
        const testUser = {
            nome: 'Teste',
            email: 'teste@teste.com',
            telefone: '123456789',
            senha: 'teste123',
            tipo_usuario: 'cliente'
        };

        await client.query(`
            INSERT INTO usuarios (nome, email, telefone, senha, tipo_usuario)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO NOTHING
        `, [testUser.nome, testUser.email, testUser.telefone, testUser.senha, testUser.tipo_usuario]);
        
        console.log('✅ Teste de inserção realizado com sucesso!');

        // Verificar se a tabela existe e tem a estrutura correta
        const tableInfo = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios'
        `);
        
        console.log('\nEstrutura da tabela usuarios:');
        tableInfo.rows.forEach(col => {
            console.log(`${col.column_name}: ${col.data_type}`);
        });

        client.release();
        console.log('\n🎉 Todos os testes completados com sucesso!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Erro durante os testes:', err);
        process.exit(1);
    }
}

testConnection(); 