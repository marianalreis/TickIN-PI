const Evento = require('../models/eventoModel');

class EventoService {
  async listarTodos() {
    return await Evento.listarEventos();
  }
  
  async obterPorId(id) {
    const evento = await Evento.obterEventoPorId(id);
    if (!evento) {
      throw new Error('Evento não encontrado');
    }
    return evento;
  }
  
  async criar(dadosEvento) {
    // Garantir que estamos usando 'hora' em vez de 'horario'
    if (dadosEvento.horario && !dadosEvento.hora) {
      dadosEvento.hora = dadosEvento.horario;
      delete dadosEvento.horario;
    }
    
    return await Evento.criarEvento(dadosEvento);
  }
  
  async atualizar(id, dadosEvento) {
    // Garantir que estamos usando 'hora' em vez de 'horario'
    if (dadosEvento.horario && !dadosEvento.hora) {
      dadosEvento.hora = dadosEvento.horario;
      delete dadosEvento.horario;
    }
    
    return await Evento.atualizarEvento(id, dadosEvento);
  }
  
  async excluir(id) {
    return await Evento.excluirEvento(id);
  }
}

module.exports = new EventoService();
