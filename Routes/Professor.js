const express = require('express');
const ProfessorController = require('../Controllers/Professor/professorController');
const atribuirNotaProfessorMiddleware = require("../Middlawares/Professor/atribuirNotaProfessorMiddleware")
const {atribuirNotaParamsSchema, atribuirNotaBodySchema} = require("../Middlawares/schemas/professorSchema")

const router = express.Router();
const AuthController = require('../Controllers/AuthController');


router.get('/auth/google', AuthController.initiateGoogleAuth);

router.get('/google/callback', AuthController.handleGoogleCallback);


router.get("/trabalhos/:id", ProfessorController.TrabalhosPorProfessor)
router.get('/localizacao/:trabalhoId/', ProfessorController.LocalizacaoTrabalho);

router.get("/nota/:professor_id", ProfessorController.NotaAluno)


router.post('/nota/aluno/:alunoId/trabalho/:trabalhoId',atribuirNotaProfessorMiddleware({params:atribuirNotaParamsSchema, body:atribuirNotaBodySchema}), ProfessorController.AtribuirNota);





module.exports = router;