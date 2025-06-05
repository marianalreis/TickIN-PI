const pool = require('../config/database');

class Inscricao {
  static async findAll() {
    const query = 'SELECT * FROM inscricoes';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM inscricoes WHERE compra_ID = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByUsuario(cpf) {
    const query = 'SELECT i.*, e.descricao as evento_nome FROM inscricoes i JOIN eventos e ON i.evento_ID = e.evento_ID WHERE i.CPF = $1';
    const { rows } = await pool.query(query, [cpf]);
    return rows;
  }

  static async findByEvento(eventoId) {
    const query = 'SELECT i.*, u.nome as usuario_nome FROM inscricoes i JOIN usuarios u ON i.CPF = u.CPF WHERE i.evento_ID = $1';
    const { rows } = await pool.query(query, [eventoId]);
    return rows;
  }

  static async create(inscricao) {
    const { compra_ID, status, data_inscricao, CPF, evento_ID } = inscricao;
    const query = 'INSERT INTO inscricoes (compra_ID, status, data_inscricao, CPF, evento_ID) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const { rows } = await pool.query(query, [compra_ID, status, data_inscricao, CPF, evento_ID]);
    return rows[0];
  }

  static async update(id, inscricao) {
    const { status, data_inscricao, CPF, evento_ID } = inscricao;
    const query = 'UPDATE inscricoes SET status = $1, data_inscricao = $2, CPF = $3, evento_ID = $4 WHERE compra_ID = $5 RETURNING *';
    const { rows } = await pool.query(query, [status, data_inscricao, CPF, evento_ID, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM inscricoes WHERE compra_ID = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Inscricao;