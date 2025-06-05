const Inscricao = require('../models/inscricaoModel');

const inscricaoController = {
  getAllInscricoes: async (req, res) => {
    try {
      const inscricoes = await Inscricao.findAll();
      res.json(inscricoes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getInscricaoById: async (req, res) => {
    try {
      const inscricao = await Inscricao.findById(req.params.id);
      if (!inscricao) {
        return res.status(404).json({ message: 'Inscrição não encontrada' });
      }
      res.json(inscricao);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getInscricoesByUsuario: async (req, res) => {
    try {
      const inscricoes = await Inscricao.findByUsuario(req.params.cpf);
      res.json(inscricoes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getInscricoesByEvento: async (req, res) => {
    try {
      const inscricoes = await Inscricao.findByEvento(req.params.eventoId);
      res.json(inscricoes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createInscricao: async (req, res) => {
    try {
      const inscricao = await Inscricao.create(req.body);
      res.status(201).json(inscricao);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateInscricao: async (req, res) => {
    try {
      const inscricao = await Inscricao.update(req.params.id, req.body);
      if (!inscricao) {
        return res.status(404).json({ message: 'Inscrição não encontrada' });
      }
      res.json(inscricao);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteInscricao: async (req, res) => {
    try {
      const inscricao = await Inscricao.delete(req.params.id);
      if (!inscricao) {
        return res.status(404).json({ message: 'Inscrição não encontrada' });
      }
      res.json({ message: 'Inscrição removida com sucesso' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = inscricaoController;