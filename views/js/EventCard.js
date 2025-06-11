class EventCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const evento = JSON.parse(this.getAttribute('data-event'));
    this.render(evento);
  }

  async handleInscricao(eventoId) {
    try {
      await ApiService.eventos.inscrever(eventoId);
      this.dispatchEvent(new CustomEvent('inscricao-sucesso'));
    } catch (error) {
      this.dispatchEvent(new CustomEvent('inscricao-erro', { 
        detail: error.message 
      }));
    }
  }

  formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  render(evento) {
    const dataEvento = new Date(evento.data);
    const hoje = new Date();
    const eventoPassado = dataEvento < hoje;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.2s;
        }

        :host(:hover) {
          transform: translateY(-4px);
        }

        .card {
          padding: 1.5rem;
        }

        .imagem {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px 8px 0 0;
        }

        .titulo {
          margin: 0;
          font-size: 1.25rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .info {
          color: #7f8c8d;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .descricao {
          color: #34495e;
          margin: 1rem 0;
          line-height: 1.5;
        }

        .organizador {
          color: #7f8c8d;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .botao {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }

        .botao-inscricao {
          background: #3498db;
          color: white;
        }

        .botao-inscricao:hover {
          background: #2980b9;
        }

        .botao-inscricao:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .status-aberto {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status-fechado {
          background: #ffebee;
          color: #c62828;
        }
      </style>

      <img 
        class="imagem" 
        src="${evento.imagem || '/assets/event-placeholder.png'}" 
        alt="${evento.titulo}"
      >
      
      <div class="card">
        <h2 class="titulo">${evento.titulo}</h2>
        
        <div class="status ${eventoPassado ? 'status-fechado' : 'status-aberto'}">
          ${eventoPassado ? 'Encerrado' : 'Aberto'}
        </div>
        
        <div class="info">
          <i class="fas fa-calendar"></i> ${this.formatarData(evento.data)} às ${evento.horario}
        </div>
        
        <div class="info">
          <i class="fas fa-map-marker-alt"></i> ${evento.local}
        </div>
        
        <p class="descricao">${evento.descricao}</p>
        
        <div class="organizador">
          <i class="fas fa-user"></i> Organizado por ${evento.organizador_nome}
        </div>
        
        <button 
          class="botao botao-inscricao" 
          onclick="this.getRootNode().host.handleInscricao('${evento.evento_id}')"
          ${eventoPassado ? 'disabled' : ''}
        >
          ${eventoPassado ? 'Evento Encerrado' : 'Inscrever-se'}
        </button>
      </div>
    `;
  }
}

customElements.define('event-card', EventCard); 