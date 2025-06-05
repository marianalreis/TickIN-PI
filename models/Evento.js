const db = require('../config/database');

class Evento {
    static async criar(evento) {
        const { data, descricao, valor, local, horario, organizador_ID } = evento;
        const query = `
            INSERT INTO eventos (data, descricao, valor, local, horario, organizador_ID)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [data, descricao, valor, local, horario, organizador_ID];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async buscarPorId(id) {
        const query = 'SELECT * FROM eventos WHERE evento_ID = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async listarTodos() {
        const query = 'SELECT * FROM eventos ORDER BY data';
        const result = await db.query(query);
        return result.rows;
    }

    static async buscarPorOrganizador(organizadorId) {
        const query = 'SELECT * FROM eventos WHERE organizador_ID = $1 ORDER BY data';
        const result = await db.query(query, [organizadorId]);
        return result.rows;
    }

    static async atualizar(id, dados) {
        const { data, descricao, valor, local, horario } = dados;
        const query = `
            UPDATE eventos 
            SET data = $2, descricao = $3, valor = $4, local = $5, horario = $6
            WHERE evento_ID = $1
            RETURNING *
        `;
        const values = [id, data, descricao, valor, local, horario];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = Evento; 