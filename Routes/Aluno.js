const express = require('express');
const AlunoController = require('../Controllers/Aluno/alunoController');
const ProfessorController = require('../Controllers/Professor/professorController');
const AdminController = require('../Controllers/Admin/adminController');
const AuthController = require('../Controllers/AuthController');
const router = express.Router();



router.get('/auth/google', AuthController.initiateGoogleAuth);

router.get('/auth/google/callback', AuthController.handleGoogleCallback);


router.get("/trabalhos", AlunoController.TodosTrabalhos)
router.get("/meustrabalhos/:aluno_id", AlunoController.MeusTrabalhos)
router.get("/localizacao/:trabalhoId", ProfessorController.LocalizacaoTrabalho)
router.get("/nota/:aluno_id/:trabalho_id", AlunoController.NotaAluno)

router.get("/guia", AdminController.ListaInstrucao)

module.exports = router;