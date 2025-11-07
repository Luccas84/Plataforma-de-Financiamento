import { contribuicoesAPI, projetosAPI } from './api.js';
import { showToast, formatarMoeda, fecharModal } from './utils.js';
import { verificarAutenticacao } from './auth.js';

// Processar contribuição
export async function processarContribuicao(projetoId, valor, recompensaId) {
  try {
    const usuario = verificarAutenticacao();
    if (!usuario) {
      showToast('Você precisa fazer login para contribuir', 'error');
      window.location.href = 'login.html';
      return;
    }
    
    await contribuicoesAPI.criar({
      projetoId: parseInt(projetoId),
      valor: parseFloat(valor),
      recompensaId: recompensaId ? parseInt(recompensaId) : null
    });
    
    showToast('Contribuição realizada com sucesso!', 'success');
    fecharModal('modalContribuicao');
    
    // Recarregar página após 1 segundo
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    showToast(error.message || 'Erro ao processar contribuição', 'error');
  }
}

// Event listener para formulário de contribuição
document.addEventListener('DOMContentLoaded', () => {
  const formContribuicao = document.getElementById('formContribuicao');
  if (formContribuicao) {
    formContribuicao.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const urlParams = new URLSearchParams(window.location.search);
      const projetoId = urlParams.get('id');
      
      if (!projetoId) {
        showToast('Projeto não encontrado', 'error');
        return;
      }
      
      const valor = parseFloat(document.getElementById('valorContribuicao').value);
      const recompensaSelecionada = document.querySelector('.recompensa-card.selected');
      const recompensaId = recompensaSelecionada ? recompensaSelecionada.dataset.id : null;
      
      if (!valor || valor <= 0) {
        showToast('Valor inválido', 'error');
        return;
      }
      
      await processarContribuicao(projetoId, valor, recompensaId);
    });
  }
});

