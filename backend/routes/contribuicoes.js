const express = require('express');
const router = express.Router();
const { verificarToken } = require('../controllers/authController');
const {
  criarContribuicao,
  buscarContribuicoes,
  dashboardCriador
} = require('../controllers/contribuicoesController');

router.post('/', verificarToken, criarContribuicao);
router.get('/projeto/:projetoId', buscarContribuicoes);
router.get('/dashboard/:usuarioId', verificarToken, dashboardCriador);

module.exports = router;

