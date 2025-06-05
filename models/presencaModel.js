const pool = require('../config/database');

class Presenca {
  static async findAll() {
    const query = 'SELECT * FROM presencas';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM presencas WHERE presenca_ID = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByInscricao(compraId) {
    const query = 'SELECT * FROM presencas WHERE compra_ID = $1';
    const { rows } = await pool.query(query, [compraId]);
    return rows[0];
  }

  static async create(presenca) {
    const { presenca_ID, presente, hora_entrada, compra_ID } = presenca;
    const query = 'INSERT INTO presencas (presenca_ID, presente, hora_entrada, compra_ID) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(query, [presenca_ID, presente, hora_entrada, compra_ID]);
    return rows[0];
  }

  static async update(id, presenca) {
    const { presente, hora_entrada, compra_ID } = presenca;
    const query = 'UPDATE presencas SET presente = $1, hora_entrada = $2, compra_ID = $3 WHERE presenca_ID = $4 RETURNING *';
    const { rows } = await pool.query(query, [presente, hora_entrada, compra_ID, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM presencas WHERE presenca_ID = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Presenca;