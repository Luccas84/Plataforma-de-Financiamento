import { projetosAPI } from './api.js';
import { formatarMoeda, calcularPorcentagem, showToast, abrirModal, fecharModal } from './utils.js';
import { verificarAutenticacao } from './auth.js';

// Carregar projetos na página inicial
export async function carregarProjetos() {
  try {
    const projetos = await projetosAPI.listar();
    const container = document.getElementById('projetosContainer');
    
    if (!container) return;
    
    if (projetos.length === 0) {
      container.innerHTML = '<p class="text-center">Nenhum projeto encontrado.</p>';
      return;
    }
    
    container.innerHTML = projetos.map(projeto => criarCardProjeto(projeto)).join('');
    
    // Adicionar event listeners aos cards
    container.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn')) {
          const projetoId = card.dataset.id;
          window.location.href = `projeto-detalhe.html?id=${projetoId}`;
        }
      });
    });
  } catch (error) {
    showToast('Erro ao carregar projetos', 'error');
    console.error(error);
  }
}

// Criar card de projeto
function criarCardProjeto(projeto) {
  const porcentagem = calcularPorcentagem(projeto.arrecadado, projeto.meta);
  const apoiadores = projeto._count?.contribuicoes || 0;
  
  return `
    <div class="card" data-id="${projeto.id}">
      <img src="${projeto.imagem}" alt="${projeto.titulo}" class="card-img" onerror="this.src='https://via.placeholder.com/400x200?text=Projeto'">
      <div class="card-body">
        <h3 class="card-title">${projeto.titulo}</h3>
        <p class="card-text">${projeto.descricao.substring(0, 100)}...</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${porcentagem}%"></div>
        </div>
        <div class="progress-info">
          <span><strong>${formatarMoeda(projeto.arrecadado)}</strong> de ${formatarMoeda(projeto.meta)}</span>
          <span>${apoiadores} apoiadores</span>
        </div>
      </div>
    </div>
  `;
}

// Carregar detalhes do projeto
export async function carregarDetalhesProjeto() {
  const urlParams = new URLSearchParams(window.location.search);
  const projetoId = urlParams.get('id');
  
  if (!projetoId) {
    showToast('Projeto não encontrado', 'error');
    window.location.href = 'projetos.html';
    return;
  }
  
  try {
    const projeto = await projetosAPI.buscar(projetoId);
    exibirDetalhesProjeto(projeto);
  } catch (error) {
    showToast('Erro ao carregar projeto', 'error');
    window.location.href = 'projetos.html';
  }
}

// Exibir detalhes do projeto
function exibirDetalhesProjeto(projeto) {
  const porcentagem = calcularPorcentagem(projeto.arrecadado, projeto.meta);
  const apoiadores = projeto.contribuicoes?.length || 0;
  
  document.getElementById('projetoTitulo').textContent = projeto.titulo;
  document.getElementById('projetoImagem').src = projeto.imagem;
  document.getElementById('projetoImagem').onerror = function() {
    this.src = 'https://via.placeholder.com/800x400?text=Projeto';
  };
  document.getElementById('projetoDescricao').textContent = projeto.descricao;
  document.getElementById('projetoCriador').textContent = projeto.criador.nome;
  
  // Atualizar progresso
  document.getElementById('progressFill').style.width = `${porcentagem}%`;
  document.getElementById('arrecadado').textContent = formatarMoeda(projeto.arrecadado);
  document.getElementById('meta').textContent = formatarMoeda(projeto.meta);
  document.getElementById('apoiadores').textContent = apoiadores;
  
  // Exibir recompensas
  const recompensasContainer = document.getElementById('recompensasContainer');
  if (projeto.recompensas.length > 0) {
    recompensasContainer.innerHTML = projeto.recompensas.map((r, index) => `
      <div class="recompensa-card" data-id="${r.id}" data-valor="${r.valorMin}">
        <div class="recompensa-valor">${formatarMoeda(r.valorMin)}</div>
        <div class="recompensa-descricao">${r.descricao}</div>
      </div>
    `).join('');
    
    // Adicionar event listeners
    recompensasContainer.querySelectorAll('.recompensa-card').forEach(card => {
      card.addEventListener('click', () => {
        recompensasContainer.querySelectorAll('.recompensa-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const valorInput = document.getElementById('valorContribuicao');
        if (valorInput) {
          valorInput.value = card.dataset.valor;
        }
      });
    });
  } else {
    recompensasContainer.innerHTML = '<p>Nenhuma recompensa disponível.</p>';
  }
  
  // Exibir contribuições
  const contribuicoesContainer = document.getElementById('contribuicoesContainer');
  if (projeto.contribuicoes && projeto.contribuicoes.length > 0) {
    contribuicoesContainer.innerHTML = projeto.contribuicoes.slice(0, 10).map(contrib => `
      <div class="contribuicao-item">
        <div class="contribuicao-info">
          <strong>${contrib.usuario.nome}</strong>
          ${contrib.recompensa ? `<span style="color: var(--cor-texto-claro); font-size: 0.9rem;"> - ${contrib.recompensa.descricao.substring(0, 50)}...</span>` : ''}
        </div>
        <div class="contribuicao-valor">${formatarMoeda(contrib.valor)}</div>
      </div>
    `).join('');
  } else {
    contribuicoesContainer.innerHTML = '<p class="text-center">Ainda não há contribuições para este projeto.</p>';
  }
  
  // Botão de contribuir
  const btnContribuir = document.getElementById('btnContribuir');
  if (btnContribuir) {
    btnContribuir.addEventListener('click', () => {
      const usuario = verificarAutenticacao();
      if (!usuario) {
        showToast('Você precisa fazer login para contribuir', 'error');
        window.location.href = 'login.html';
        return;
      }
      abrirModal('modalContribuicao');
    });
  }
}

// Inicialização
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
  document.addEventListener('DOMContentLoaded', carregarProjetos);
}

if (window.location.pathname.includes('projeto-detalhe.html')) {
  document.addEventListener('DOMContentLoaded', carregarDetalhesProjeto);
}

if (window.location.pathname.includes('projetos.html')) {
  document.addEventListener('DOMContentLoaded', carregarProjetos);
}

