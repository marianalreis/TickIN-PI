const Inscricao = require('../models/inscricaoModel');
const Evento = require('../models/eventoModel');

const inscricaoController = {
  getAllInscricoes: async (req, res) => {
    try {
      const inscricoes = await Inscricao.findAll();
      res.status(200).json(inscricoes);
    } catch (error) {
      console.error('Erro ao listar inscrições:', error);
      res.status(500).json({ erro: 'Erro ao listar inscrições' });
    }
  },

  getInscricoesByEvento: async (req, res) => {
    try {
      const inscricoes = await Inscricao.findByEvento(req.params.eventoId);
      res.status(200).json(inscricoes);
    } catch (error) {
      console.error('Erro ao listar inscrições do evento:', error);
      res.status(500).json({ erro: 'Erro ao listar inscrições do evento' });
    }
  },

  getMinhasInscricoes: async (req, res) => {
    try {
      if (!req.session?.usuario?.id) {
        return res.status(401).json({ erro: 'Usuário não autenticado' });
      }

      const inscricoes = await Inscricao.findByUsuario(req.session.usuario.id);
      res.status(200).json(inscricoes);
    } catch (error) {
      console.error('Erro ao listar minhas inscrições:', error);
      res.status(500).json({ erro: 'Erro ao listar suas inscrições' });
    }
  },

  createInscricao: async (req, res) => {
    try {
      // Verificar autenticação
      if (!req.session?.usuario?.id) {
        console.error('Tentativa de inscrição sem autenticação');
        return res.status(401).json({ erro: 'Usuário não autenticado. Por favor, faça login.' });
      }

      const { evento_id } = req.body;
      if (!evento_id) {
        console.error('Tentativa de inscrição sem ID do evento');
        return res.status(400).json({ erro: 'ID do evento é obrigatório' });
      }

      // Verificar se o evento existe
      const evento = await Evento.findById(evento_id);
      if (!evento) {
        console.error(`Tentativa de inscrição em evento inexistente (ID: ${evento_id})`);
        return res.status(404).json({ erro: 'Evento não encontrado' });
      }

      // Verificar se o evento já passou
      const dataEvento = new Date(evento.data);
      if (dataEvento < new Date()) {
        console.error(`Tentativa de inscrição em evento passado (ID: ${evento_id})`);
        return res.status(400).json({ erro: 'Este evento já foi encerrado' });
      }

      // Verificar se já está inscrito
      const inscricaoExistente = await Inscricao.findByEventoEUsuario(evento_id, req.session.usuario.id);
      if (inscricaoExistente) {
        console.error(`Usuário já inscrito no evento (Usuario: ${req.session.usuario.id}, Evento: ${evento_id})`);
        return res.status(400).json({ erro: 'Você já está inscrito neste evento' });
      }

      // Criar inscrição
      console.log(`Criando inscrição (Usuario: ${req.session.usuario.id}, Evento: ${evento_id})`);
      const inscricao = await Inscricao.create({
        usuario_id: req.session.usuario.id,
        evento_id: evento_id,
        status: 'Confirmado'
      });

      console.log('Inscrição criada com sucesso:', inscricao);
      res.status(201).json({
        success: true,
        message: 'Inscrição realizada com sucesso',
        inscricao: inscricao
      });
    } catch (error) {
      console.error('Erro ao criar inscrição:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ 
        erro: 'Erro ao criar inscrição. Por favor, tente novamente.',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  cancelarInscricao: async (req, res) => {
    try {
      if (!req.session?.usuario?.id) {
        return res.status(401).json({ erro: 'Usuário não autenticado' });
      }

      const inscricao = await Inscricao.findById(req.params.id);
      if (!inscricao) {
        return res.status(404).json({ erro: 'Inscrição não encontrada' });
      }

      if (inscricao.usuario_id !== req.session.usuario.id) {
        return res.status(403).json({ erro: 'Você não tem permissão para cancelar esta inscrição' });
      }

      await Inscricao.delete(req.params.id);
      res.status(200).json({ mensagem: 'Inscrição cancelada com sucesso' });
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      res.status(500).json({ erro: 'Erro ao cancelar inscrição' });
    }
  },

  getUsuariosInscritos: async (req, res) => {
    try {
      const eventoId = req.params.eventoId;
      
      // Buscar informações do evento
      const evento = await Evento.findById(eventoId);
      if (!evento) {
        return res.status(404).render('error', { 
          message: 'Evento não encontrado' 
        });
      }

      // Verificar se o usuário logado é o organizador do evento
      if (evento.usuario_id !== req.session?.usuario?.id) {
        return res.status(403).render('error', { 
          message: 'Você não tem permissão para ver os inscritos deste evento' 
        });
    }

      // Buscar todas as inscrições do evento
      const inscricoes = await Inscricao.findByEvento(eventoId);

      res.render('pages/usuariosInscritos', {
        event: evento,
        inscricoes: inscricoes
      });
    } catch (error) {
      console.error('Erro ao listar usuários inscritos:', error);
      res.status(500).render('error', { 
        message: 'Erro ao carregar usuários inscritos' 
      });
    }
  },

  atualizarPresenca: async (req, res) => {
    try {
      const inscricaoId = req.params.inscricaoId;
      const { presente } = req.body;

      // Buscar a inscrição
      const inscricao = await Inscricao.findById(inscricaoId);
      if (!inscricao) {
        return res.status(404).json({ 
          error: 'Inscrição não encontrada' 
        });
      }

      // Verificar se o usuário logado é o organizador do evento
      const evento = await Evento.findById(inscricao.evento_id);
      if (evento.usuario_id !== req.session?.usuario?.id) {
        return res.status(403).json({ 
          error: 'Você não tem permissão para atualizar a presença' 
        });
      }

      // Atualizar a presença
      await Inscricao.update(inscricaoId, { presente: presente });

      res.json({ 
        success: true, 
        message: `Presença ${presente ? 'confirmada' : 'removida'} com sucesso!` 
      });
    } catch (error) {
      console.error('Erro ao atualizar presença:', error);
      res.status(500).json({ 
        error: 'Erro ao atualizar presença' 
      });
    }
  }
};

module.exports = inscricaoController;