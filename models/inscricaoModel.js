const pool = require('../config/database');

class Inscricao {
  // Buscar todas as inscrições
  static async findAll() {
    try {
      const query = `
        SELECT 
          i.inscricao_id, i.status, i.data_inscricao,
          e.titulo as evento_titulo, e.data as evento_data,
          u.nome as usuario_nome
        FROM inscricoes i
        JOIN eventos e ON i.evento_id = e.evento_id
        JOIN usuarios u ON i.usuario_id = u.id
        ORDER BY i.data_inscricao DESC
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
      throw error;
    }
  }

  // Buscar inscrição por ID
  static async findById(id) {
    try {
      const query = `
        SELECT 
          i.inscricao_id, i.status, i.data_inscricao,
          e.titulo as evento_titulo, e.data as evento_data,
          e.horario as evento_horario, e.local as evento_local,
          e.imagem as evento_imagem,
          u.nome as usuario_nome
        FROM inscricoes i
        JOIN eventos e ON i.evento_id = e.evento_id
        JOIN usuarios u ON i.usuario_id = u.id
        WHERE i.inscricao_id = $1
      `;
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar inscrição:', error);
      throw error;
    }
  }

  // Buscar inscrições por usuário
  static async findByUsuario(usuario_id) {
    try {
      const query = `
        SELECT 
          i.inscricao_id,
          i.status,
          i.data_inscricao,
          e.evento_id,
          e.titulo,
          e.descricao,
          e.data,
          e.horario,
          e.local,
          e.imagem,
          u.id as organizador_id,
          u.nome as organizador_nome
        FROM inscricoes i
        JOIN eventos e ON i.evento_id = e.evento_id
        JOIN usuarios u ON e.usuario_id = u.id
        WHERE i.usuario_id = $1
        ORDER BY e.data DESC
      `;
      const { rows } = await pool.query(query, [usuario_id]);
      
      return rows.map(row => ({
        inscricao_id: row.inscricao_id,
        status: row.status,
        inscricao_data: row.data_inscricao,
        evento: {
          id: row.evento_id,
          titulo: row.titulo,
          descricao: row.descricao,
          data: row.data,
          horario: row.horario,
          local: row.local,
          imagem: row.imagem,
          organizador: {
            id: row.organizador_id,
            nome: row.organizador_nome
          }
        }
      }));
    } catch (error) {
      console.error('Erro ao buscar inscrições do usuário:', error);
      throw error;
    }
  }

  // Buscar inscrições por evento
  static async findByEvento(eventoId) {
    try {
      const query = `
        SELECT 
          i.inscricao_id, 
          i.status, 
          i.data_inscricao,
          i.presente,
          u.nome as usuario_nome, 
          u.email,
          e.titulo as evento_titulo
        FROM inscricoes i
        JOIN usuarios u ON i.usuario_id = u.id
        JOIN eventos e ON i.evento_id = e.evento_id
        WHERE i.evento_id = $1
        ORDER BY i.data_inscricao DESC
      `;
      const { rows } = await pool.query(query, [eventoId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar inscrições por evento:', error);
      throw error;
    }
  }

  // Verificar se usuário já está inscrito no evento
  static async findByEventoEUsuario(evento_id, usuario_id) {
    try {
      const query = `
        SELECT inscricao_id, status
        FROM inscricoes
        WHERE evento_id = $1 AND usuario_id = $2
      `;
      const { rows } = await pool.query(query, [evento_id, usuario_id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao verificar inscrição:', error);
      throw error;
    }
  }

  // Criar nova inscrição
  static async create({ usuario_id, evento_id, status = 'Pendente' }) {
    try {
      const query = `
        INSERT INTO inscricoes (usuario_id, evento_id, status, data_inscricao)
        VALUES ($1, $2, $3, CURRENT_DATE)
        RETURNING inscricao_id, usuario_id, evento_id, status, data_inscricao
      `;
      const values = [usuario_id, evento_id, status];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Erro ao criar inscrição:', error);
      throw error;
    }
  }

  // Atualizar inscrição
  static async update(id, { status, presente }) {
    try {
      let query, values;
      
      if (status !== undefined && presente !== undefined) {
        query = `
          UPDATE inscricoes
          SET status = $1, presente = $2
          WHERE inscricao_id = $3
          RETURNING inscricao_id, usuario_id, evento_id, status, presente, data_inscricao
        `;
        values = [status, presente, id];
      } else if (status !== undefined) {
        query = `
          UPDATE inscricoes
          SET status = $1
          WHERE inscricao_id = $2
          RETURNING inscricao_id, usuario_id, evento_id, status, presente, data_inscricao
        `;
        values = [status, id];
      } else if (presente !== undefined) {
        query = `
          UPDATE inscricoes
          SET presente = $1
          WHERE inscricao_id = $2
          RETURNING inscricao_id, usuario_id, evento_id, status, presente, data_inscricao
        `;
        values = [presente, id];
      } else {
        throw new Error('Nenhum campo para atualizar foi fornecido');
      }

      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Erro ao atualizar inscrição:', error);
      throw error;
    }
  }

  // Deletar inscrição
  static async delete(id) {
    try {
      const query = `
        DELETE FROM inscricoes
        WHERE inscricao_id = $1
        RETURNING inscricao_id
      `;
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao deletar inscrição:', error);
      throw error;
    }
  }
}

module.exports = Inscricao;