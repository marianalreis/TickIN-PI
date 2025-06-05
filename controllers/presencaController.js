const Presenca = require('../models/presencaModel');

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
      const presenca = await Presenca.update(req.params.id, req.body);
      if (!presenca) {
        return res.status(404).json({ message: 'Registro de presença não encontrado' });
      }
      res.json(presenca);
    } catch (error) {
      res.status(500).json({ message: error.message });
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