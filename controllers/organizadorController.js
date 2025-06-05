const Organizador = require('../models/organizadorModel');

const organizadorController = {
  getAllOrganizadores: async (req, res) => {
    try {
      const organizadores = await Organizador.findAll();
      res.json(organizadores);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getOrganizadorById: async (req, res) => {
    try {
      const organizador = await Organizador.findById(req.params.id);
      if (!organizador) {
        return res.status(404).json({ message: 'Organizador não encontrado' });
      }
      res.json(organizador);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createOrganizador: async (req, res) => {
    try {
      const organizador = await Organizador.create(req.body);
      res.status(201).json(organizador);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateOrganizador: async (req, res) => {
    try {
      const organizador = await Organizador.update(req.params.id, req.body);
      if (!organizador) {
        return res.status(404).json({ message: 'Organizador não encontrado' });
      }
      res.json(organizador);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteOrganizador: async (req, res) => {
    try {
      const organizador = await Organizador.delete(req.params.id);
      if (!organizador) {
        return res.status(404).json({ message: 'Organizador não encontrado' });
      }
      res.json({ message: 'Organizador removido com sucesso' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = organizadorController;