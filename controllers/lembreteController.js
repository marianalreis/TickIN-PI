const Lembrete = require('../models/lembreteModel');

const lembreteController = {
  getAllLembretes: async (req, res) => {
    try {
      const lembretes = await Lembrete.findAll();
      res.json(lembretes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getLembreteById: async (req, res) => {
    try {
      const lembrete = await Lembrete.findById(req.params.id);
      if (!lembrete) {
        return res.status(404).json({ message: 'Lembrete não encontrado' });
      }
      res.json(lembrete);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getLembretesByUsuario: async (req, res) => {
    try {
      const lembretes = await Lembrete.findByUsuario(req.params.cpf);
      res.json(lembretes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getLembretesByEvento: async (req, res) => {
    try {
      const lembretes = await Lembrete.findByEvento(req.params.eventoId);
      res.json(lembretes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createLembrete: async (req, res) => {
    try {
      const lembrete = await Lembrete.create(req.body);
      res.status(201).json(lembrete);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateLembrete: async (req, res) => {
    try {
      const lembrete = await Lembrete.update(req.params.id, req.body);
      if (!lembrete) {
        return res.status(404).json({ message: 'Lembrete não encontrado' });
      }
      res.json(lembrete);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteLembrete: async (req, res) => {
    try {
      const lembrete = await Lembrete.delete(req.params.id);
      if (!lembrete) {
        return res.status(404).json({ message: 'Lembrete não encontrado' });
      }
      res.json({ message: 'Lembrete removido com sucesso' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = lembreteController;