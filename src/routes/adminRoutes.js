const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/adminController');  
const validationMiddleware = require('../middlewares/validationMiddleware');
const { cadastroTrabalhosSchema, cadastroGuiaSapexSchema, cadastroLocalizacaoSchema } = require('../validators/adminValidators');
const AuthAdminController = require('../controllers/Admin/authAdminController');
const multer = require('multer');
const { storage } = require('../config/multerConfig');

const upload = multer({storage})



//Cadastro de trabalho e instruções 
router.post('/cadastrotrabalhos', validationMiddleware(cadastroTrabalhosSchema), AdminController.CadastroTrabalhos);
router.post('/guia/cadastro', validationMiddleware(cadastroGuiaSapexSchema), AdminController.CadastroInstrucao);
router.post('/cadastrolocalizacao', validationMiddleware(cadastroLocalizacaoSchema), AdminController.CadastroLocalizacao);
router.post('/cadastrotrabalhos/lote', upload.single('file') , AdminController.CadastroTrabalhosEmLote)


//Gets 
router.get('/listatrabalhos', AdminController.ListaTrabalhos); 
router.get('/infostrabalho/:id', AdminController.InfosTrabalho); 
router.get('/guia', AdminController.ListaInstrucao); 
router.get('/listar', AdminController.ListarAdministradores)

//deletes
router.delete('/guia/:id', AdminController.DeletarGuiaSapex)
router.delete('/trabalho/:id', AdminController.DeletarTrabalho)

//updates
router.put('/trabalho/editar/:id', AdminController.EditarTrabalho)
router.put('/alterar-senha', AuthAdminController.AlterarSenha)

//Autenticação
router.post("/login", AuthAdminController.login)
router.post('/esqueci-senha', AuthAdminController.EsqueciMinhaSenha)
router.post('/cadastro', AuthAdminController.CadastroAdmin)



module.exports = router;
