const express = require('express');
const AlunoController = require('../controllers/Aluno/alunoController');
const ProfessorController = require('../controllers/Professor/professorController');
const AdminController = require('../controllers/Admin/adminController');
const gerarTokenController = require('../controllers/Aluno/GerarTokenRequest/gerarTokenController');
const InteracoesTrabalhoController = require('../controllers/Aluno/interacoesTrabalhoController');

const router = express.Router();



//Endpoints de informações de trabalhos 
router.get("/trabalhos", AlunoController.TodosTrabalhos)
router.get("/meustrabalhos/:aluno_email", AlunoController.MeusTrabalhos)
router.get("/localizacao/:token", ProfessorController.LocalizacaoTrabalho)
router.get("/nota/:token", AlunoController.NotaAluno)

//Guia do Sapex 
router.get("/guia", AdminController.ListaInstrucao)


//Gerar Token para requests
router.get("/gerartoken/:aluno_email/:trabalho_id", gerarTokenController.GerarToken)
router.get("/local/gerartoken/:trabalho_id", gerarTokenController.GerarTokenViewLocal )



//Comentarios e Likes
router.get("/comentarios/:trabalho_id", InteracoesTrabalhoController.ComentariosTrabalho)
router.delete("/comentarios", InteracoesTrabalhoController.DeletarComentario)
router.post("/cadastrar/comentario", InteracoesTrabalhoController.PostarComentario)
router.post("/like/comentario", InteracoesTrabalhoController.CurtirComentario)

router.post("/like/trabalho", InteracoesTrabalhoController.CurtirTrabalho)



module.exports = router;