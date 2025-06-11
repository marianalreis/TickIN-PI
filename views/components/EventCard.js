class EventCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['data-event'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-event' && newValue) {
      this.event = JSON.parse(newValue);
    }
  }

  set event(data) {
    this.render(data);
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  async handleInscricao(eventoId) {
    try {
      await ApiService.inscricoes.criar(eventoId);
      this.dispatchEvent(new CustomEvent('inscricao-sucesso'));
    } catch (error) {
      this.dispatchEvent(new CustomEvent('inscricao-erro', { 
        detail: error.message 
      }));
    }
  }

  render(event) {
    const styles = `
      <style>
        :host {
          display: block;
          margin: 1rem;
        }

        .event-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .event-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .event-content {
          padding: 1.5rem;
        }

        .event-title {
          margin: 0 0 1rem;
          font-size: 1.25rem;
          color: #2c3e50;
        }

        .event-details {
          margin: 0 0 1rem;
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .event-price {
          font-size: 1.25rem;
          color: #2ecc71;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .event-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          width: 100%;
          transition: background 0.2s;
        }

        .event-button:hover {
          background: #2980b9;
        }

        .organizer {
          display: flex;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        .organizer img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 1rem;
        }

        .organizer-info {
          font-size: 0.9rem;
          color: #666;
        }
      </style>
    `;

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="event-card">
        <img 
          src="${event.image}" 
          alt="${event.title}" 
          class="event-image"
        >
        <div class="event-content">
          <h3 class="event-title">${event.title}</h3>
          <p class="event-details">
            <span>📅 ${this.formatDate(event.date)}</span><br>
            <span>⏰ ${event.time}</span><br>
            <span>📍 ${event.location}</span>
          </p>
          <div class="event-price">
            ${this.formatPrice(event.price)}
          </div>
          <button 
            class="event-button"
            @click="this.handleInscricao('${event.id}')"
          >
            Inscrever-se
          </button>
          <div class="organizer">
            <img 
              src="${event.organizer.image}" 
              alt="${event.organizer.name}"
            >
            <div class="organizer-info">
              <div>Organizado por</div>
              <div><strong>${event.organizer.name}</strong></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Adicionar event listener para o botão
    const button = this.shadowRoot.querySelector('.event-button');
    button.addEventListener('click', () => this.handleInscricao(event.id));
  }
}

customElements.define('event-card', EventCard); 