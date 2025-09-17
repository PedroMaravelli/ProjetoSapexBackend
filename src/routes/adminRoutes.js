const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/adminController');  
const validationMiddleware = require('../middlewares/validationMiddleware');
const { cadastroTrabalhosSchema, cadastroGuiaSapexSchema, cadastroLocalizacaoSchema } = require('../validators/adminValidators');
const AuthAdminController = require('../controllers/Admin/authAdminController');





router.post('/cadastrotrabalhos', validationMiddleware(cadastroTrabalhosSchema), AdminController.CadastroTrabalhos);
router.post('/guia/cadastro', validationMiddleware(cadastroGuiaSapexSchema), AdminController.CadastroInstrucao);
router.post('/cadastrolocalizacao', validationMiddleware(cadastroLocalizacaoSchema), AdminController.CadastroLocalizacao);
router.post("/login", AuthAdminController.login)


router.get('/listatrabalhos', AdminController.ListaTrabalhos); 
router.get('/infostrabalho/:id', AdminController.InfosTrabalho); 
router.get('/guia', AdminController.ListaInstrucao); 

router.delete('/guia/:id', AdminController.DeletarGuiaSapex)
router.delete('/trabalho/:id', AdminController.DeletarTrabalho)

router.put('/trabalho/editar/:id', AdminController.EditarTrabalho)
router.put('/alterarsenha', AuthAdminController.AlterarSenha)


router.post('/esquecisenha', AuthAdminController.EsqueciMinhaSenha)


module.exports = router;
