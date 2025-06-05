const pool = require('../config/database');

class Lembrete {
  static async findAll() {
    const query = 'SELECT * FROM lembretes';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM lembretes WHERE mensagem_ID = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByUsuario(cpf) {
    const query = 'SELECT * FROM lembretes WHERE CPF = $1';
    const { rows } = await pool.query(query, [cpf]);
    return rows;
  }

  static async findByEvento(eventoId) {
    const query = 'SELECT * FROM lembretes WHERE evento_ID = $1';
    const { rows } = await pool.query(query, [eventoId]);
    return rows;
  }

  static async create(lembrete) {
    const { mensagem_ID, mensagem, CPF, evento_ID } = lembrete;
    const query = 'INSERT INTO lembretes (mensagem_ID, mensagem, CPF, evento_ID) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(query, [mensagem_ID, mensagem, CPF, evento_ID]);
    return rows[0];
  }

  static async update(id, lembrete) {
    const { mensagem, CPF, evento_ID } = lembrete;
    const query = 'UPDATE lembretes SET mensagem = $1, CPF = $2, evento_ID = $3 WHERE mensagem_ID = $4 RETURNING *';
    const { rows } = await pool.query(query, [mensagem, CPF, evento_ID, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM lembretes WHERE mensagem_ID = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Lembrete;