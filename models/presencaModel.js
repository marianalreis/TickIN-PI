const pool = require('../config/database');

class Presenca {
  // Buscar todas as presenças com informações detalhadas
  static async findAll() {
    try {
      const query = `
        SELECT p.*, i.CPF, i.evento_ID, u.nome as usuario_nome, e.descricao as evento_descricao
        FROM presencas p
        JOIN inscricoes i ON p.inscricao_id = i.inscricao_id
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
      const query = 'SELECT * FROM presencas WHERE presenca_id = $1';
      const { rows } = await pool.query(query, [id]);
      console.log('Resultado da busca por presença:', rows);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar presença por ID:', error);
      throw error;
    }
  }

  // Buscar presença por inscrição
  static async findByInscricao(compraId) {
    try {
    const query = 'SELECT * FROM presencas WHERE inscricao_id = $1';
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
        SELECT p.presenca_id, p.presente, p.horario_entrada, p.inscricao_id
        FROM presencas p
        JOIN inscricoes i ON p.inscricao_id = i.inscricao_id
        WHERE i.evento_id = $1
      `;
      const result = await pool.query(query, [eventoId]);
      console.log('Presenças encontradas para o evento:', {
        evento_id: eventoId,
        presencas: result.rows.map(p => ({
          presenca_id: p.presenca_id,
          presente: p.presente,
          inscricao_id: p.inscricao_id
        }))
      });
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar presenças do evento:', error);
      throw error;
    }
  }

  // Buscar presença pendente por inscrição
  static async findPendenteByInscricao(inscricaoId) {
    try {
      const query = `
        SELECT presenca_id, presente, horario_entrada
        FROM presencas
        WHERE inscricao_id = $1
      `;
      const { rows } = await pool.query(query, [inscricaoId]);
      console.log('Presença pendente encontrada:', rows[0]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar presença pendente:', error);
      throw error;
    }
  }

  // Criar nova presença
  static async create(presenca) {
    try {
    const { presenca_ID, presente, horario_entrada, inscricao_id } = presenca;
    const query = 'INSERT INTO presencas (presenca_ID, presente, horario_entrada, inscricao_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(query, [presenca_ID, presente, horario_entrada, inscricao_id]);
    return rows[0];
    } catch (error) {
      console.error('Erro ao criar presença:', error);
      throw error;
    }
  }

  // Atualizar presença
  static async update(id, presenca) {
    try {
      console.log('Atualizando presença:', { id, presenca });
      const { presente } = presenca;
      const query = `
        UPDATE presencas 
        SET presente = $1, 
            horario_entrada = CASE 
              WHEN $1 = true THEN CURRENT_TIMESTAMP 
              ELSE NULL 
            END
        WHERE presenca_id = $2 
        RETURNING *
      `;
      const { rows } = await pool.query(query, [presente, id]);
      console.log('Presença atualizada:', rows[0]);
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