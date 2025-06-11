const pool = require('../config/database');

class Evento {
  // Buscar todos os eventos
  static async findAll(filtros = {}) {
    try {
      console.log('Buscando eventos com filtros:', filtros);
      
      let query = `
        SELECT e.evento_id as id, e.titulo, e.descricao, e.data, e.horario, e.local, e.usuario_id, e.imagem, 
               u.nome as organizador_nome
        FROM eventos e
        LEFT JOIN usuarios u ON e.usuario_id = u.id
        WHERE 1=1
      `;
      
      const params = [];
      
      // Aplicar filtros
      if (filtros.termo) {
        query += ` AND (
          LOWER(e.titulo) LIKE LOWER($${params.length + 1}) OR 
          LOWER(e.descricao) LIKE LOWER($${params.length + 1}) OR
          LOWER(e.local) LIKE LOWER($${params.length + 1})
        )`;
        params.push(`%${filtros.termo}%`);
      }

      // Filtrar por status (baseado na data do evento)
      if (filtros.status === 'aberto') {
        query += ` AND e.data >= CURRENT_DATE`;
      } else if (filtros.status === 'fechado') {
        query += ` AND e.data < CURRENT_DATE`;
      }

      // Ordenação
      query += ' ORDER BY ';
      switch (filtros.ordem) {
        case 'nome':
          query += 'e.titulo';
          break;
        case 'data':
        default:
          query += 'e.data, e.horario';
      }

      console.log('Query SQL:', query);
      console.log('Parâmetros:', params);

      const { rows } = await pool.query(query, params);
      console.log(`Encontrados ${rows.length} eventos`);
      
      return rows.map(row => ({
        id: row.id,
        titulo: row.titulo,
        descricao: row.descricao,
        data: row.data,
        horario: row.horario,
        local: row.local,
        usuario_id: row.usuario_id,
        imagem: row.imagem,
        organizador_nome: row.organizador_nome
      }));
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      console.error('Stack trace:', error.stack);
      if (error.code === '42P01') {
        throw new Error('Tabela de eventos não encontrada. Verifique se o banco de dados está corretamente configurado.');
      } else if (error.code === '42703') {
        throw new Error('Coluna não encontrada. Verifique se todas as colunas necessárias existem na tabela.');
      } else if (error.code === '28P01') {
        throw new Error('Erro de autenticação no banco de dados. Verifique as credenciais.');
      } else {
        throw new Error('Erro ao buscar eventos: ' + error.message);
      }
    }
  }

  // Buscar evento por ID
  static async findById(id) {
    try {
      console.log('Buscando evento por ID:', id);
      
      const query = `
        SELECT e.evento_id, e.titulo, e.descricao, e.data, e.horario, e.local, e.usuario_id, e.imagem, 
               u.nome as organizador_nome
        FROM eventos e
        LEFT JOIN usuarios u ON e.usuario_id = u.id
        WHERE e.evento_id = $1
      `;
      
      const { rows } = await pool.query(query, [id]);
      console.log('Evento encontrado:', rows[0]);
      
      if (rows[0]) {
        return {
          id: rows[0].evento_id,
          titulo: rows[0].titulo,
          descricao: rows[0].descricao,
          data: rows[0].data,
          horario: rows[0].horario,
          local: rows[0].local,
          usuario_id: rows[0].usuario_id,
          imagem: rows[0].imagem,
          organizador_nome: rows[0].organizador_nome
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar evento por ID:', error);
      console.error('Stack trace:', error.stack);
      throw new Error('Erro ao buscar evento: ' + error.message);
    }
  }

  // Buscar eventos por organizador
  static async findByOrganizador(organizadorId) {
    try {
      console.log('Buscando eventos do organizador:', organizadorId);
      
      const query = `
        SELECT e.evento_id, e.titulo, e.descricao, e.data, e.horario, e.local, e.usuario_id, e.imagem, 
               u.nome as organizador_nome
        FROM eventos e
        LEFT JOIN usuarios u ON e.usuario_id = u.id
        WHERE e.usuario_id = $1
        ORDER BY e.data DESC
      `;
      
      const { rows } = await pool.query(query, [organizadorId]);
      console.log(`Encontrados ${rows.length} eventos do organizador`);
      
      return rows.map(row => ({
        id: row.evento_id,
        titulo: row.titulo,
        descricao: row.descricao,
        data: row.data,
        horario: row.horario,
        local: row.local,
        usuario_id: row.usuario_id,
        imagem: row.imagem,
        organizador_nome: row.organizador_nome
      }));
    } catch (error) {
      console.error('Erro ao buscar eventos por organizador:', error);
      console.error('Stack trace:', error.stack);
      throw new Error('Erro ao buscar eventos do organizador: ' + error.message);
    }
  }

  // Criar novo evento
  static async create(evento) {
    try {
      console.log('Criando novo evento:', evento);
      
      const { titulo, descricao, data, horario, local, usuario_id, imagem } = evento;
      const query = `
        INSERT INTO eventos (titulo, descricao, data, horario, local, usuario_id, imagem)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [titulo, descricao, data, horario, local, usuario_id, imagem];
      
      const { rows } = await pool.query(query, values);
      console.log('Evento criado:', rows[0]);
      
      return rows[0];
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      console.error('Stack trace:', error.stack);
      throw new Error('Erro ao criar evento: ' + error.message);
    }
  }

  // Atualizar evento
  static async update(id, evento) {
    try {
      console.log('Atualizando evento:', { id, evento });
      
      const { titulo, descricao, data, horario, local, imagem } = evento;
      const query = `
        UPDATE eventos
        SET titulo = $1, descricao = $2, data = $3, horario = $4, local = $5, imagem = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7 AND usuario_id = $8
        RETURNING *
      `;
      const values = [titulo, descricao, data, horario, local, imagem, id, evento.usuario_id];
      
      const { rows } = await pool.query(query, values);
      console.log('Evento atualizado:', rows[0]);
      
      return rows[0];
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      console.error('Stack trace:', error.stack);
      throw new Error('Erro ao atualizar evento: ' + error.message);
    }
  }

  // Deletar evento
  static async delete(id, usuario_id) {
    try {
      console.log('Deletando evento:', { id, usuario_id });
      
      const query = 'DELETE FROM eventos WHERE id = $1 AND usuario_id = $2 RETURNING *';
      const { rows } = await pool.query(query, [id, usuario_id]);
      
      console.log('Evento deletado:', rows[0]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      console.error('Stack trace:', error.stack);
      throw new Error('Erro ao deletar evento: ' + error.message);
    }
  }

  // Buscar eventos por data
  static async findByDate(data) {
    try {
      console.log('Buscando eventos por data:', data);
      
      const query = `
        SELECT e.*, u.nome as organizador_nome
        FROM eventos e
        LEFT JOIN usuarios u ON e.usuario_id = u.id
        WHERE e.data = $1
        ORDER BY e.horario
      `;
      
      const { rows } = await pool.query(query, [data]);
      console.log(`Encontrados ${rows.length} eventos na data`);
      
      return rows;
    } catch (error) {
      console.error('Erro ao buscar eventos por data:', error);
      console.error('Stack trace:', error.stack);
      throw new Error('Erro ao buscar eventos por data: ' + error.message);
    }
  }
}

module.exports = Evento;

