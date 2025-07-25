const express = require('express');
const router = express.Router();
const AdminController = require('../Controllers/Admin/adminController');  
const AuthAdminController = require('../Controllers/Admin/authAdminController');  
const cadastroTrabalhosMiddleware = require("../Middlawares/Admin/cadastroTrabalhosMiddleware")
const cadastroGuiaSapexMiddleware = require("../Middlawares/Admin/cadastroGuiaSapexMiddleware")

const {cadastroTrabalhosAdminSchema} = require("../Middlawares/schemas/adminSchemaValidation")
const {cadastroGuiaSapexSchema} = require("../Middlawares/schemas/adminSchemaValidation")


router.post('/login', AuthAdminController.Login);
router.post('/cadastrotrabalhos',cadastroTrabalhosMiddleware(cadastroTrabalhosAdminSchema), AdminController.CadastroTrabalhos);
router.post('/guia/cadastro', cadastroGuiaSapexMiddleware(cadastroGuiaSapexSchema), AdminController.CadastroInstrucao);
router.post('/cadastrolocalizacao', AdminController.CadastroLocalizacao);


router.get('/listatrabalhos', AdminController.ListaTrabalhos); 
router.get('/infostrabalho/:id', AdminController.InfosTrabalho); 
router.get('/guia', AdminController.ListaInstrucao); 


module.exports = router;
