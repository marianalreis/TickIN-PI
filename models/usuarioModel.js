const pool = require("../config/database");

class Usuario {
  static async findAll() {
    const query = "SELECT * FROM usuarios";
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findByCPF(cpf) {
    const query = "SELECT * FROM usuarios WHERE CPF = $1";
    const { rows } = await pool.query(query, [cpf]);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async create(usuario) {
    const { CPF, nome, email, endereco, telefone } = usuario;
    const query =
      "INSERT INTO usuarios (CPF, nome, email, endereco, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const { rows } = await pool.query(query, [
      CPF,
      nome,
      email,
      endereco,
      telefone,
    ]);
    return rows[0];
  }

  static async update(cpf, usuario) {
    const { nome, email, endereco, telefone } = usuario;
    const query =
      "UPDATE usuarios SET nome = $1, email = $2, endereco = $3, telefone = $4 WHERE CPF = $5 RETURNING *";
    const { rows } = await pool.query(query, [
      nome,
      email,
      endereco,
      telefone,
      cpf,
    ]);
    return rows[0];
  }

  static async delete(cpf) {
    const query = "DELETE FROM usuarios WHERE CPF = $1 RETURNING *";
    const { rows } = await pool.query(query, [cpf]);
    return rows[0];
  }
}

module.exports = Usuario;
