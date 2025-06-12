const pool = require('../config/database');

class Presenca {
  // Buscar todas as presenças com informações detalhadas
  static async findAll() {
    try {
      const query = `
        SELECT p.*, i.CPF, i.evento_ID, u.nome as usuario_nome, e.descricao as evento_descricao
        FROM presencas p
        JOIN inscricoes i ON p.compra_ID = i.compra_ID
        JOIN usuarios u ON i.CPF = u.CPF
        JOIN eventos e ON i.evento_ID = e.evento_ID
        ORDER BY p.horario_entrada DESC
      `;
    const { rows } = await pool.query(query);
    return rows;
    } catch (error) {
      console.error('Erro ao buscar presenças:', error);
      throw error;
    }
  }

  // Buscar presença por ID com informações detalhadas
  static async findById(id) {
    try {
      const query = `
        SELECT p.*, i.CPF, i.evento_ID, u.nome as usuario_nome, e.descricao as evento_descricao
        FROM presencas p
        JOIN inscricoes i ON p.compra_ID = i.compra_ID
        JOIN usuarios u ON i.CPF = u.CPF
        JOIN eventos e ON i.evento_ID = e.evento_ID
        WHERE p.presenca_ID = $1
      `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
    } catch (error) {
      console.error('Erro ao buscar presença por ID:', error);
      throw error;
    }
  }

  // Buscar presença por inscrição
  static async findByInscricao(compraId) {
    try {
    const query = 'SELECT * FROM presencas WHERE compra_ID = $1';
    const { rows } = await pool.query(query, [compraId]);
    return rows[0];
    } catch (error) {
      console.error('Erro ao buscar presença por inscrição:', error);
      throw error;
    }
  }

  // Buscar presenças por evento
  static async findByEvento(eventoId) {
    try {
      const query = `
        SELECT p.*, i.inscricao_id, u.nome as usuario_nome, u.email
        FROM presencas p
        JOIN inscricoes i ON p.inscricao_id = i.inscricao_id
        JOIN usuarios u ON i.usuario_id = u.id
        WHERE i.evento_id = $1
      `;
      const { rows } = await pool.query(query, [eventoId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar presenças por evento:', error);
      throw error;
    }
  }

  // Criar nova presença
  static async create(presenca) {
    try {
    const { presenca_ID, presente, hora_entrada, compra_ID } = presenca;
    const query = 'INSERT INTO presencas (presenca_ID, presente, hora_entrada, compra_ID) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(query, [presenca_ID, presente, hora_entrada, compra_ID]);
    return rows[0];
    } catch (error) {
      console.error('Erro ao criar presença:', error);
      throw error;
    }
  }

  // Atualizar presença
  static async update(id, presenca) {
    try {
    const { presente, hora_entrada, compra_ID } = presenca;
    const query = 'UPDATE presencas SET presente = $1, hora_entrada = $2, compra_ID = $3 WHERE presenca_ID = $4 RETURNING *';
    const { rows } = await pool.query(query, [presente, hora_entrada, compra_ID, id]);
    return rows[0];
    } catch (error) {
      console.error('Erro ao atualizar presença:', error);
      throw error;
    }
  }

  // Deletar presença
  static async delete(id) {
    try {
    const query = 'DELETE FROM presencas WHERE presenca_ID = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
    } catch (error) {
      console.error('Erro ao deletar presença:', error);
      throw error;
    }
  }
}

module.exports = Presenca;