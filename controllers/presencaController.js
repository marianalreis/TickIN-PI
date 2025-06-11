const Presenca = require('../models/presencaModel');
const Inscricao = require('../models/inscricaoModel');
const Evento = require('../models/eventoModel');

const presencaController = {
  getAllPresencas: async (req, res) => {
    try {
      const presencas = await Presenca.findAll();
      res.json(presencas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPresencaById: async (req, res) => {
    try {
      const presenca = await Presenca.findById(req.params.id);
      if (!presenca) {
        return res.status(404).json({ message: 'Registro de presença não encontrado' });
      }
      res.json(presenca);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPresencasByEvento: async (req, res) => {
    try {
      const presencas = await Presenca.findByEvento(req.params.eventoId);
      res.json(presencas);
    } catch (error) {
      console.error('Erro ao buscar presenças do evento:', error);
      res.status(500).json({ message: error.message });
    }
  },

  getPresencaByInscricao: async (req, res) => {
    try {
      const presenca = await Presenca.findByInscricao(req.params.compraId);
      if (!presenca) {
        return res.status(404).json({ message: 'Registro de presença não encontrado' });
      }
      res.json(presenca);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createPresenca: async (req, res) => {
    try {
      const presenca = await Presenca.create(req.body);
      res.status(201).json(presenca);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updatePresenca: async (req, res) => {
    try {
      console.log('Recebido PUT /api/presencas/:id', {
        id: req.params.id,
        body: req.body,
        usuario: req.session.usuario
      });

      if (!req.session?.usuario?.id) {
        console.error('Usuário não autenticado');
        return res.status(401).json({ erro: 'Usuário não autenticado' });
      }

      const presenca = await Presenca.findById(req.params.id);
      if (!presenca) {
        console.error('Presença não encontrada:', req.params.id);
        return res.status(404).json({ erro: 'Registro de presença não encontrado' });
      }

      // Verificar se o usuário é o organizador do evento
      const inscricao = await Inscricao.findById(presenca.inscricao_id);
      if (!inscricao) {
        console.error('Inscrição não encontrada para a presença:', presenca.inscricao_id);
        return res.status(404).json({ erro: 'Inscrição não encontrada' });
      }

      const evento = await Evento.findById(inscricao.evento_id);
      if (!evento) {
        console.error('Evento não encontrado para a inscrição:', inscricao.evento_id);
        return res.status(404).json({ erro: 'Evento não encontrado' });
      }

      console.log('Verificando permissões:', {
        'evento.usuario_id': evento.usuario_id,
        'session.usuario.id': req.session.usuario.id,
        'match': Number(evento.usuario_id) === Number(req.session.usuario.id)
      });

      if (Number(evento.usuario_id) !== Number(req.session.usuario.id)) {
        console.error('Usuário não autorizado a atualizar presença');
        return res.status(403).json({ erro: 'Você não tem permissão para atualizar esta presença' });
      }

      const presencaAtualizada = await Presenca.update(req.params.id, req.body);
      console.log('Presença atualizada com sucesso:', presencaAtualizada);
      
      res.json({ 
        message: 'Presença atualizada com sucesso',
        presenca: presencaAtualizada
      });
    } catch (error) {
      console.error('Erro ao atualizar presença:', error);
      res.status(500).json({ erro: 'Erro ao atualizar presença' });
    }
  },

  deletePresenca: async (req, res) => {
    try {
      const presenca = await Presenca.delete(req.params.id);
      if (!presenca) {
        return res.status(404).json({ message: 'Registro de presença não encontrado' });
      }
      res.json({ message: 'Registro de presença removido com sucesso' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = presencaController;