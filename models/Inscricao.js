const db = require('../config/database');

class Inscricao {
    static async criar(inscricao) {
        const { status, data_inscricao, cpf, evento_id } = inscricao;
        const query = `
            INSERT INTO inscricoes (status, data_inscricao, CPF, evento_ID)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [status, data_inscricao, cpf, evento_id];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async buscarPorId(id) {
        const query = 'SELECT * FROM inscricoes WHERE compra_ID = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async buscarPorUsuario(cpf) {
        const query = `
            SELECT i.*, e.descricao, e.data, e.horario, e.local
            FROM inscricoes i
            JOIN eventos e ON i.evento_ID = e.evento_ID
            WHERE i.CPF = $1
            ORDER BY e.data
        `;
        const result = await db.query(query, [cpf]);
        return result.rows;
    }

    static async buscarPorEvento(eventoId) {
        const query = `
            SELECT i.*, u.nome, u.email
            FROM inscricoes i
            JOIN usuarios u ON i.CPF = u.CPF
            WHERE i.evento_ID = $1
            ORDER BY i.data_inscricao
        `;
        const result = await db.query(query, [eventoId]);
        return result.rows;
    }

    static async atualizarStatus(id, status) {
        const query = `
            UPDATE inscricoes 
            SET status = $2
            WHERE compra_ID = $1
            RETURNING *
        `;
        const result = await db.query(query, [id, status]);
        return result.rows[0];
    }
}

module.exports = Inscricao; 