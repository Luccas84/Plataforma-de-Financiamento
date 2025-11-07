const express = require('express');
const router = express.Router();
const { verificarToken } = require('../controllers/authController');
const {
  listarProjetos,
  buscarProjeto,
  criarProjeto,
  editarProjeto,
  deletarProjeto,
  adicionarRecompensa
} = require('../controllers/projetosController');

// Rotas públicas
router.get('/', listarProjetos);
router.get('/:id', buscarProjeto);

// Rotas protegidas
router.post('/', verificarToken, criarProjeto);
router.put('/:id', verificarToken, editarProjeto);
router.delete('/:id', verificarToken, deletarProjeto);
router.post('/:id/recompensas', verificarToken, adicionarRecompensa);

module.exports = router;

