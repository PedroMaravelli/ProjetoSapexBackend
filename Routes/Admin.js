const express = require('express');
const router = express.Router();
const AdminController = require('../Controllers/Admin/adminController');  

router.post('/cadastrotrabalhos', AdminController.CadastroTrabalhos);
router.post('/guia/cadastro', AdminController.CadastroInstrucao);
router.post('/cadastrolocalizacao', AdminController.CadastroLocalizacao);





router.get('/listatrabalhos', AdminController.ListaTrabalhos); 
router.get('/infostrabalho/:id', AdminController.InfosTrabalho); 

router.get('/guia', AdminController.ListaInstrucao); 
 
router.post('/login', AdminController.Login);


module.exports = router;
