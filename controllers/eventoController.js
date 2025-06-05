const eventoModel = require('../models/eventoModel');

const eventoController = {
  listarEventos: async (req, res) => {
    try {
      const eventos = await eventoModel.listarEventos();
      res.status(200).json(eventos);
    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      res.status(500).json({ message: error.message });
    }
  },
  
  obterEventoPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const evento = await eventoModel.obterEventoPorId(id);
      
      if (!evento) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }
      
      res.status(200).json(evento);
    } catch (error) {
      console.error('Erro ao obter evento:', error);
      res.status(500).json({ message: error.message });
    }
  },
  
  criarEvento: async (req, res) => {
    try {
      console.log('Dados recebidos para criar evento:', req.body);
      
      // Converter 'horario' para 'hora' se necessário
      if (req.body.horario && !req.body.hora) {
        req.body.hora = req.body.horario;
        delete req.body.horario;
      }
      
      // Validar dados obrigatórios
      const { titulo, data, hora, local } = req.body;
      if (!titulo || !data || !hora || !local) {
        return res.status(400).json({ 
          message: 'Dados incompletos. Título, data, hora e local são obrigatórios.' 
        });
      }
      
      const novoEvento = await eventoModel.criarEvento(req.body);
      console.log('Evento criado com sucesso:', novoEvento);
      
      res.status(201).json(novoEvento);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      res.status(500).json({ message: error.message });
    }
  },
  
  atualizarEvento: async (req, res) => {
    try {
      const id = req.params.id;
      
      // Converter 'horario' para 'hora' se necessário
      if (req.body.horario && !req.body.hora) {
        req.body.hora = req.body.horario;
        delete req.body.horario;
      }
      
      const evento = await eventoModel.obterEventoPorId(id);
      
      if (!evento) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }
      
      const eventoAtualizado = await eventoModel.atualizarEvento(id, req.body);
      res.status(200).json(eventoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      res.status(500).json({ message: error.message });
    }
  },
  
  excluirEvento: async (req, res) => {
    try {
      const id = req.params.id;
      const evento = await eventoModel.obterEventoPorId(id);
      
      if (!evento) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }
      
      const eventoExcluido = await eventoModel.excluirEvento(id);
      res.status(200).json({ message: 'Evento excluído com sucesso', evento: eventoExcluido });
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = eventoController;



