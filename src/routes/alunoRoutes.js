const express = require('express');
const AlunoController = require('../controllers/Aluno/alunoController');
const ProfessorController = require('../controllers/Professor/professorController');
const AdminController = require('../controllers/Admin/adminController');
const gerarTokenController = require('../controllers/Aluno/GerarTokenRequest/gerarTokenController')

const router = express.Router();




router.get("/trabalhos", AlunoController.TodosTrabalhos)
router.get("/meustrabalhos/:aluno_email", AlunoController.MeusTrabalhos)
router.get("/localizacao/:token", ProfessorController.LocalizacaoTrabalho)
router.get("/nota/:token", AlunoController.NotaAluno)
router.get("/comentarios/:trabalho_id", AlunoController.ComentariosTrabalho)

router.get("/gerartoken/:aluno_email/:trabalho_id", gerarTokenController.GerarToken)
router.get("/local/gerartoken/:trabalho_id", gerarTokenController.GerarTokenViewLocal )


router.get("/guia", AdminController.ListaInstrucao)

module.exports = router;