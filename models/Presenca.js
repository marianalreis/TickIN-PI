const pool = require('../config/database');

class Presenca {
  // Buscar todas as presenças
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

  // Buscar presença por ID
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

  // Buscar presenças por evento
  static async findByEvento(eventoId) {
    try {
      const query = `
        SELECT p.*, i.CPF, u.nome as usuario_nome
        FROM presencas p
        JOIN inscricoes i ON p.compra_ID = i.compra_ID
        JOIN usuarios u ON i.CPF = u.CPF
        WHERE i.evento_ID = $