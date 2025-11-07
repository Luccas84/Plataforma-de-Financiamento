import { authAPI } from './api.js';
import { showToast } from './utils.js';

// Verificar se usuário está logado
export function verificarAutenticacao() {
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');
  
  if (token && usuario) {
    return JSON.parse(usuario);
  }
  
  return null;
}

// Redirecionar se não estiver logado
export function requerAutenticacao() {
  const usuario = verificarAutenticacao();
  if (!usuario) {
    window.location.href = 'login.html';
    return null;
  }
  return usuario;
}

// Login
export async function fazerLogin(email, senha) {
  try {
    const response = await authAPI.login(email, senha);
    localStorage.setItem('token', response.token);
    localStorage.setItem('usuario', JSON.stringify(response.usuario));
    showToast('Login realizado com sucesso!', 'success');
    return response;
  } catch (error) {
    showToast(error.message || 'Erro ao fazer login', 'error');
    throw error;
  }
}

// Cadastro
export async function fazerCadastro(nome, email, senha) {
  try {
    const response = await authAPI.cadastro(nome, email, senha);
    localStorage.setItem('token', response.token);
    localStorage.setItem('usuario', JSON.stringify(response.usuario));
    showToast('Cadastro realizado com sucesso!', 'success');
    return response;
  } catch (error) {
    showToast(error.message || 'Erro ao fazer cadastro', 'error');
    throw error;
  }
}

// Logout
export function fazerLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'index.html';
}

// Event listeners para páginas de login/cadastro
if (window.location.pathname.includes('login.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        try {
          await fazerLogin(email, senha);
          setTimeout(() => {
            window.location.href = 'projetos.html';
          }, 1000);
        } catch (error) {
          // Erro já mostrado no toast
        }
      });
    }
  });
}

if (window.location.pathname.includes('cadastro.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        try {
          await fazerCadastro(nome, email, senha);
          setTimeout(() => {
            window.location.href = 'projetos.html';
          }, 1000);
        } catch (error) {
          // Erro já mostrado no toast
        }
      });
    }
  });
}

