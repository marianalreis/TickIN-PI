const pool = require("../config/database");
const bcrypt = require("bcrypt");

class Usuario {
  // Buscar todos os usuários
  static async findAll() {
    try {
      const query = "SELECT id, cpf, nome, email, telefone, tipo_usuario, created_at FROM usuarios";
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  // Buscar usuário por CPF
  static async findByCPF(cpf) {
    try {
      const query = "SELECT * FROM usuarios WHERE cpf = $1";
      const { rows } = await pool.query(query, [cpf]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar usuário por CPF:', error);
      throw error;
    }
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    try {
      const query = "SELECT * FROM usuarios WHERE email = $1";
      const { rows } = await pool.query(query, [email]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  }

  // Criar novo usuário
  static async create(usuario) {
    try {
      const { cpf, nome, email, telefone, senha, tipo_usuario } = usuario;
      
      // Hash da senha antes de salvar
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);
      
      const query = `
        INSERT INTO usuarios (cpf, nome, email, telefone, senha, tipo_usuario)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, cpf, nome, email, telefone, tipo_usuario, created_at
      `;
      const values = [cpf, nome, email, telefone, senhaHash, tipo_usuario];
      
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Atualizar usuário
  static async update(identificador, dados) {
    try {
      const { nome, cpf, telefone, email, senha, tipo_usuario } = dados;
      let query, values;

      // Se uma nova senha foi fornecida, fazer o hash
      let senhaHash;
      if (senha) {
        const salt = await bcrypt.genSalt(10);
        senhaHash = await bcrypt.hash(senha, salt);
      }

      // Verifica se o identificador é CPF ou email
      if (identificador.includes('@')) {
        query = `
          UPDATE usuarios 
          SET nome = $1, 
              telefone = $2, 
              tipo_usuario = $3
              ${senha ? ', senha = $4' : ''}
          WHERE email = ${senha ? '$5' : '$4'}
          RETURNING id, cpf, nome, email, telefone, tipo_usuario, created_at
        `;
        values = senha 
          ? [nome, telefone, tipo_usuario, senhaHash, identificador]
          : [nome, telefone, tipo_usuario, identificador];
      } else {
        query = `
          UPDATE usuarios 
          SET nome = $1, 
              email = $2, 
              telefone = $3, 
              tipo_usuario = $4
              ${senha ? ', senha = $5' : ''}
          WHERE cpf = ${senha ? '$6' : '$5'}
          RETURNING id, cpf, nome, email, telefone, tipo_usuario, created_at
        `;
        values = senha 
          ? [nome, email, telefone, tipo_usuario, senhaHash, identificador]
          : [nome, email, telefone, tipo_usuario, identificador];
      }

      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Deletar usuário
  static async delete(identificador) {
    try {
      let query;
      // Verifica se o identificador é CPF ou email
      if (identificador.includes('@')) {
        query = "DELETE FROM usuarios WHERE email = $1 RETURNING id, cpf, nome, email";
      } else {
        query = "DELETE FROM usuarios WHERE cpf = $1 RETURNING id, cpf, nome, email";
      }
      
      const { rows } = await pool.query(query, [identificador]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }

  static async buscarPorEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async verificarSenha(senha, senhaHash) {
    return await bcrypt.compare(senha, senhaHash);
  }
}

module.exports = Usuario;
