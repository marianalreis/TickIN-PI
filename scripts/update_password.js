const bcrypt = require('bcrypt');
const pool = require('../config/database');
require('dotenv').config();

async function updatePassword() {
  try {
    // Gerar novo hash da senha
    const senha = '123456'; // Senha padrão
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Atualizar a senha do usuário
    const query = "UPDATE usuarios SET senha = $1 WHERE email = $2 RETURNING *";
    const { rows } = await pool.query(query, [senhaHash, 'rwreis@gmail.com']);

    if (rows[0]) {
      console.log('Senha atualizada com sucesso para o usuário:', rows[0].email);
    } else {
      console.log('Usuário não encontrado');
    }

  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
  } finally {
    await pool.end();
  }
}

updatePassword();