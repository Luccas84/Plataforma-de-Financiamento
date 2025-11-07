// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';

// Função auxiliar para fazer requisições
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
}

// Auth
export const authAPI = {
  login: (email, senha) => apiRequest('/auth/login', {
    method: 'POST',
    body: { email, senha }
  }),

  cadastro: (nome, email, senha) => apiRequest('/auth/cadastro', {
    method: 'POST',
    body: { nome, email, senha }
  })
};

// Projetos
export const projetosAPI = {
  listar: () => apiRequest('/projetos'),
  
  buscar: (id) => apiRequest(`/projetos/${id}`),
  
  criar: (dados) => apiRequest('/projetos', {
    method: 'POST',
    body: dados
  }),
  
  editar: (id, dados) => apiRequest(`/projetos/${id}`, {
    method: 'PUT',
    body: dados
  }),
  
  deletar: (id) => apiRequest(`/projetos/${id}`, {
    method: 'DELETE'
  }),
  
  adicionarRecompensa: (projetoId, recompensa) => apiRequest(`/projetos/${projetoId}/recompensas`, {
    method: 'POST',
    body: recompensa
  })
};

// Contribuições
export const contribuicoesAPI = {
  criar: (dados) => apiRequest('/contribuicoes', {
    method: 'POST',
    body: dados
  }),
  
  buscarPorProjeto: (projetoId) => apiRequest(`/contribuicoes/projeto/${projetoId}`),
  
  dashboard: (usuarioId) => apiRequest(`/contribuicoes/dashboard/${usuarioId}`)
};

