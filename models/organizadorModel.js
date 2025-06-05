const pool = require('../config/database');

class Organizador {
  static async findAll() {
    const query = 'SELECT * FROM organizadores';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM organizadores WHERE organizador_ID = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async create(organizador) {
    const { organizador_ID, nome, colaboradores, funcao, evento_ID, CPF } = organizador;
    const query = 'INSERT INTO organizadores (organizador_ID, nome, colaboradores, funcao, evento_ID, CPF) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const { rows } = await pool.query(query, [organizador_ID, nome, colaboradores, funcao, evento_ID, CPF]);
    return rows[0];
  }

  static async update(id, organizador) {
    const { nome, colaboradores, funcao, evento_ID, CPF } = organizador;
    const query = 'UPDATE organizadores SET nome = $1, colaboradores = $2, funcao = $3, evento_ID = $4, CPF = $5 WHERE organizador_ID = $6 RETURNING *';
    const { rows } = await pool.query(query, [nome, colaboradores, funcao, evento_ID, CPF, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM organizadores WHERE organizador_ID = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Organizador;