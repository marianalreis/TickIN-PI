const pool = require("../config/database");
const bcrypt = require("bcryptjs");

class Usuario {
  static async findAll() {
    const query = "SELECT id, nome, email, telefone, tipo_usuario, created_at FROM usuarios";
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
    try {
      const { nome, email, telefone, senha, tipo_usuario } = usuario;
      
      // Hash da senha antes de salvar
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);
      
    const query =
        "INSERT INTO usuarios (nome, email, telefone, senha, tipo_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, telefone, tipo_usuario, created_at";
      const values = [nome, email, telefone, senhaHash, tipo_usuario];
      
      const { rows } = await pool.query(query, values);
    return rows[0];
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  static async update(email, usuario) {
    const { nome, telefone, tipo_usuario } = usuario;
    const query =
      "UPDATE usuarios SET nome = $1, telefone = $2, tipo_usuario = $3 WHERE email = $4 RETURNING id, nome, email, telefone, tipo_usuario, created_at";
    const { rows } = await pool.query(query, [
      nome,
      telefone,
      tipo_usuario,
      email,
    ]);
    return rows[0];
  }

  static async delete(email) {
    const query = "DELETE FROM usuarios WHERE email = $1 RETURNING id, nome, email";
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async validatePassword(senha, senhaHash) {
    return await bcrypt.compare(senha, senhaHash);
  }
}

module.exports = Usuario;
