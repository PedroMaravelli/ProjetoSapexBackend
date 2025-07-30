const express = require('express');
const AlunoController = require('../controllers/Aluno/alunoController');
const ProfessorController = require('../controllers/Professor/professorController');
const AdminController = require('../controllers/Admin/adminController');

const router = express.Router();




router.get("/trabalhos", AlunoController.TodosTrabalhos)
router.get("/meustrabalhos/:aluno_id", AlunoController.MeusTrabalhos)
router.get("/localizacao/:trabalhoId", ProfessorController.LocalizacaoTrabalho)
router.get("/nota/:aluno_id/:trabalho_id", AlunoController.NotaAluno)

router.get("/guia", AdminController.ListaInstrucao)

module.exports = router;