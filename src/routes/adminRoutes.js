const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/adminController');  
const cadastroTrabalhosMiddleware = require("../middlawares/Admin/cadastroTrabalhosMiddleware")
const cadastroGuiaSapexMiddleware = require("../middlawares/Admin/cadastroGuiaSapexMiddleware")

const {cadastroTrabalhosAdminSchema} = require("../middlawares/schemas/adminSchemaValidation")
const {cadastroGuiaSapexSchema} = require("../middlawares/schemas/adminSchemaValidation")




router.post('/cadastrotrabalhos',cadastroTrabalhosMiddleware(cadastroTrabalhosAdminSchema), AdminController.CadastroTrabalhos);
router.post('/guia/cadastro',cadastroGuiaSapexMiddleware(cadastroGuiaSapexSchema), AdminController.CadastroInstrucao);
router.post('/cadastrolocalizacao', AdminController.CadastroLocalizacao);


router.get('/listatrabalhos', AdminController.ListaTrabalhos); 
router.get('/infostrabalho/:id', AdminController.InfosTrabalho); 
router.get('/guia', AdminController.ListaInstrucao); 


module.exports = router;
