const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/adminController');  
const cadastroTrabalhosMiddleware = require("../middlawares/Admin/cadastroTrabalhosMiddleware")
const cadastroGuiaSapexMiddleware = require("../middlawares/Admin/cadastroGuiaSapexMiddleware")

const {cadastroTrabalhosAdminSchema} = require("../middlawares/schemas/adminSchemaValidation")
const {cadastroGuiaSapexSchema} = require("../middlawares/schemas/adminSchemaValidation");
const AuthAdminController = require('../controllers/Admin/authAdminController');





router.post('/cadastrotrabalhos',cadastroTrabalhosMiddleware(cadastroTrabalhosAdminSchema), AdminController.CadastroTrabalhos);
router.post('/guia/cadastro',cadastroGuiaSapexMiddleware(cadastroGuiaSapexSchema), AdminController.CadastroInstrucao);
router.post('/cadastrolocalizacao', AdminController.CadastroLocalizacao);
router.post("/login", AuthAdminController.login)


router.get('/listatrabalhos', AdminController.ListaTrabalhos); 
router.get('/infostrabalho/:id', AdminController.InfosTrabalho); 
router.get('/guia', AdminController.ListaInstrucao); 

router.delete('/guia/:id', AdminController.DeletarGuiaSapex)
router.delete('/trabalho/:id', AdminController.DeletarTrabalho)

router.put('/trabalho/editar/:id', AdminController.EditarTrabalho)


module.exports = router;
