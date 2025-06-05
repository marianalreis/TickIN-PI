const db = require('../config/database');

class Usuario {
    static async criar(usuario) {
        const { cpf, nome, email, endereco, telefone } = usuario;
        const query = `
            INSERT INTO usuarios (CPF, nome, email, endereco, telefone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [cpf, nome, email, endereco, telefone];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async buscarPorCPF(cpf) {
        const query = 'SELECT * FROM usuarios WHERE CPF = $1';
        const result = await db.query(query, [cpf]);
        return result.rows[0];
    }

    static async buscarPorEmail(email) {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    static async atualizar(cpf, dados) {
        const { nome, email, endereco, telefone } = dados;
        const query = `
            UPDATE usuarios 
            SET nome = $2, email = $3, endereco = $4, telefone = $5
            WHERE CPF = $1
            RETURNING *
        `;
        const values = [cpf, nome, email, endereco, telefone];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = Usuario; 