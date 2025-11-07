const express = require('express');
const router = express.Router();
const { cadastro, login } = require('../controllers/authController');

router.post('/cadastro', cadastro);
router.post('/login', login);

module.exports = router;

