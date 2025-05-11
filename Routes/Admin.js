const express = require('express');
const router = express.Router();
const AdminController = require('../Controllers/Admin/adminController');  

// Rota para cadastrar um novo trabalho (POST)
router.post('/cadastrotrabalhos', AdminController.CadastroTrabalhos);
router.post('/guia/cadastro', AdminController.CadastroInstrucao);
router.post('/cadastrolocalizacao', AdminController.CadastroLocalizacao);



// Rota para listar todos os trabalhos (GET)
router.get('/listatrabalhos', AdminController.ListaTrabalhos);  // Certifique-se de que essa função está definida no controlador
router.get('/guia', AdminController.ListaInstrucao);  // Certifique-se de que essa função está definida no controlador


module.exports = router;
