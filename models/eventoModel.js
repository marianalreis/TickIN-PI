const pool = require('../config/database');

class Evento {
  static async findAll() {
    const query = 'SELECT * FROM eventos';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM eventos WHERE evento_ID = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async create(evento) {
    const { evento_ID, data, descricao, valor, local, hora, organizador_ID } = evento;
    const query = 'INSERT INTO eventos (evento_ID, data, descricao, valor, local, hora, organizador_ID) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const { rows } = await pool.query(query, [evento_ID, data, descricao, valor, local, hora, organizador_ID]);
    return rows[0];
  }

  static async update(id, evento) {
    const { data, descricao, valor, local, hora, organizador_ID } = evento;
    const query = 'UPDATE eventos SET data = $1, descricao = $2, valor = $3, local = $4, hora = $5, organizador_ID = $6 WHERE evento_ID = $7 RETURNING *';
    const { rows } = await pool.query(query, [data, descricao, valor, local, hora, organizador_ID, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM eventos WHERE evento_ID = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Evento;

