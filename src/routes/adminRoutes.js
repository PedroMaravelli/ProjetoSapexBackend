const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/adminController');  
const validationMiddleware = require('../middlewares/validationMiddleware');
const authAdminMiddleware = require('../middlewares/authAdminMiddleware');
const { cadastroTrabalhosSchema, cadastroGuiaSapexSchema, cadastroLocalizacaoSchema } = require('../validators/adminValidators');
const AuthAdminController = require('../controllers/Admin/authAdminController');
const multer = require('multer');
const { storage } = require('../config/multerConfig');

const upload = multer({storage})



//Rotas públicas (sem autenticação)
router.post("/login", AuthAdminController.login)
router.post('/esqueci-senha', AuthAdminController.EsqueciMinhaSenha)

//Rotas protegidas (com autenticação)
router.post('/cadastrotrabalhos', authAdminMiddleware, validationMiddleware(cadastroTrabalhosSchema), AdminController.CadastroTrabalhos);
router.post('/guia/cadastro', authAdminMiddleware, validationMiddleware(cadastroGuiaSapexSchema), AdminController.CadastroInstrucao);
router.post('/cadastrolocalizacao', authAdminMiddleware, validationMiddleware(cadastroLocalizacaoSchema), AdminController.CadastroLocalizacao);
router.post('/cadastrotrabalhos/lote', authAdminMiddleware, upload.single('file'), AdminController.CadastroTrabalhosEmLote)
router.post('/cadastro', authAdminMiddleware, AuthAdminController.CadastroAdmin)

router.get('/listatrabalhos', authAdminMiddleware, AdminController.ListaTrabalhos); 
router.get('/infostrabalho/:id', authAdminMiddleware, AdminController.InfosTrabalho); 
router.get('/guia', authAdminMiddleware, AdminController.ListaInstrucao); 
router.get('/listar', authAdminMiddleware, AdminController.ListarAdministradores)

router.delete('/guia/:id', authAdminMiddleware, AdminController.DeletarGuiaSapex)
router.delete('/trabalho/:id', authAdminMiddleware, AdminController.DeletarTrabalho)

router.put('/trabalho/editar/:id', authAdminMiddleware, AdminController.EditarTrabalho)
router.put('/alterar-senha', authAdminMiddleware, AuthAdminController.AlterarSenha)





module.exports = router;
