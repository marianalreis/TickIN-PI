const pool = require('../config/database');

async function checkInscricoesTable() {
    try {
        // Verificar se a tabela existe
        const tableExists = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'inscricoes'
            );
        `);
        
        if (!tableExists.rows[0].exists) {
            console.log('❌ Tabela inscricoes não existe!');
            return;
        }

        // Verificar estrutura da tabela
        const { rows } = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'inscricoes'
            ORDER BY ordinal_position;
        `);

        console.log('\nEstrutura da tabela inscricoes:');
        console.table(rows);

        // Tentar criar uma inscrição de teste
        try {
            const testInsert = await pool.query(`
                INSERT INTO inscricoes (usuario_id, evento_id, status)
                VALUES ($1, $2, $3)
                RETURNING *;
            `, [1, 1, 'teste']);
            console.log('\n✅ Teste de inserção bem sucedido!');
            
            // Limpar o teste
            await pool.query('DELETE FROM inscricoes WHERE id = $1', [testInsert.rows[0].id]);
        } catch (insertError) {
            console.error('\n❌ Erro ao tentar inserir:', insertError.message);
        }

    } catch (error) {
        console.error('Erro ao verificar tabela:', error);
    } finally {
        await pool.end();
    }
}

checkInscricoesTable(); 