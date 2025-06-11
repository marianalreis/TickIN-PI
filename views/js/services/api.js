
class ApiService {
  static async request(endpoint, options = {}) {
    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro na requisição');
      }

      return response.json();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static handleError(error) {
    console.error('API Error:', error);
    
    if (error.status === 401) {
      window.location.href = '/login';
      return;
    }

    if (error.status === 403) {
      alert('Você não tem permissão para realizar esta ação');
      return;
    }

    alert(error.message || 'Ocorreu um erro. Por favor, tente novamente.');
  }

  // Eventos
  static eventos = {
    listar: (filtros = {}) => {
      const params = new URLSearchParams(filtros);
      return ApiService.request(`/eventos?${params}`);
    },
    
    buscar: (id) => ApiService.request(`/eventos/${id}`),
    
    criar: (dados) => ApiService.request('/eventos', {
      method: 'POST',
      body: JSON.stringify(dados)
    }),
    
    atualizar: (id, dados) => ApiService.request(`/eventos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    }),
    
    deletar: (id) => ApiService.request(`/eventos/${id}`, {
      method: 'DELETE'
    })
  };

  // Inscrições
  static inscricoes = {
    listarMinhas: () => ApiService.request('/inscricoes/minhas'),
    
    listarPorEvento: (eventoId) => ApiService.request(`/inscricoes/evento/${eventoId}`),
    
    criar: (eventoId) => ApiService.request('/inscricoes', {
      method: 'POST',
      body: JSON.stringify({ eventoId })
    }),
    
    cancelar: (id) => ApiService.request(`/inscricoes/${id}`, {
      method: 'DELETE'
    })
  };

  // Presenças
  static presencas = {
    marcar: (inscricaoId) => ApiService.request('/presencas', {
      method: 'POST',
      body: JSON.stringify({ inscricaoId })
    }),
    
    desmarcar: (inscricaoId) => ApiService.request(`/presencas/${inscricaoId}`, {
      method: 'DELETE'
    })
  };

  // Lembretes
  static lembretes = {
    listar: () => ApiService.request('/lembretes'),
    
    criar: (dados) => ApiService.request('/lembretes', {
      method: 'POST',
      body: JSON.stringify(dados)
    }),
    
    atualizar: (id, dados) => ApiService.request(`/lembretes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    }),
    
    deletar: (id) => ApiService.request(`/lembretes/${id}`, {
      method: 'DELETE'
    })
  };
} 