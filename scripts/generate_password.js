const bcrypt = require('bcrypt');
const pool = require('../config/database');

async function generatePassword() {
    try {
        const senha = '123456';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt);
        
        console.log('Novo hash gerado:', hash);
        
        // Atualizar a senha no banco
        const query = "UPDATE usuarios SET senha = $1 WHERE email = $2 RETURNING *";
        const { rows } = await pool.query(query, [hash, 'rwreis@gmail.com']);
        
        if (rows[0]) {
            console.log('Senha atualizada com sucesso para:', rows[0].email);
            
            // Verificar se a senha está correta
            const senhaCorreta = await bcrypt.compare(senha, rows[0].senha);
            console.log('Teste de senha:', senhaCorreta ? 'OK' : 'Falhou');
        } else {
            console.log('Usuário não encontrado');
        }
    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await pool.end();
    }
}

generatePassword();