const Evento = require('../models/eventoModel');

const eventoController = {
  getAllEventos: async (req, res) => {
    try {
      const eventos = await Evento.findAll();
      res.status(200).json(eventos);
    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      res.status(500).json({ message: error.message });
    }
  },
  
  getEventoById: async (req, res) => {
    try {
      const id = req.params.id;
      const evento = await Evento.findById(id);
      
      if (!evento) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }
      
      res.status(200).json(evento);
    } catch (error) {
      console.error('Erro ao obter evento:', error);
      res.status(500).json({ message: error.message });
    }
  },
  
  getEventosByOrganizador: async (req, res) => {
    try {
      const organizadorId = req.params.organizadorId;
      const eventos = await Evento.findByOrganizador(organizadorId);
      res.status(200).json(eventos);
    } catch (error) {
      console.error('Erro ao buscar eventos do organizador:', error);
      res.status(500).json({ message: error.message });
    }
  },
  
  createEvento: async (req, res) => {
    try {
      const { titulo, descricao, data, horario, local } = req.body;
      
      // Validar dados obrigatórios
      if (!titulo || !data || !horario || !local) {
        return res.status(400).json({ 
          message: 'Dados incompletos. Título, data, horário e local são obrigatórios.' 
        });
      }

      // Validar formato da data
      if (new Date(data).toString() === 'Invalid Date') {
        return res.status(400).json({
          message: 'Formato de data inválido'
        });
      }
      
      const novoEvento = await Evento.create({
        titulo,
        descricao,
        data,
        horario,
        local,
        usuario_id: req.session.usuario.id // Usar ID do usuário da sessão
      });
      
      res.status(201).json(novoEvento);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      res.status(500).json({ erro: 'Erro ao criar evento: ' + error.message });
    }
  },
  
  updateEvento: async (req, res) => {
    try {
      const id = req.params.id;
      const { data, descricao, valor, local, horario, organizador_ID } = req.body;
      
      // Verificar se evento existe
      const eventoExistente = await Evento.findById(id);
      if (!eventoExistente) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }
      
      // Validar formato da data se fornecida
      if (data && new Date(data).toString() === 'Invalid Date') {
        return res.status(400).json({
          message: 'Formato de data inválido'
        });
      }

      // Validar valor se fornecido
      if (valor && isNaN(parseFloat(valor))) {
        return res.status(400).json({
          message: 'Valor deve ser um número válido'
        });
      }
      
      const eventoAtualizado = await Evento.update(id, {
        data: data || eventoExistente.data,
        descricao: descricao || eventoExistente.descricao,
        valor: valor ? parseFloat(valor) : eventoExistente.valor,
        local: local || eventoExistente.local,
        horario: horario || eventoExistente.horario,
        organizador_ID: organizador_ID || eventoExistente.organizador_ID
      });

      res.status(200).json(eventoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      res.status(500).json({ message: error.message });
    }
  },
  
  deleteEvento: async (req, res) => {
    try {
      const id = req.params.id;
      
      // Verificar se evento existe
      const evento = await Evento.findById(id);
      if (!evento) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }
      
      await Evento.delete(id);
      res.status(200).json({ 
        message: 'Evento excluído com sucesso',
        evento
      });
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = eventoController;



