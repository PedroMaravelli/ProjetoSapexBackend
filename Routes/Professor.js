const express = require('express');
const ProfessorController = require('../Controllers/Professor/professorController');
const AuthProfessorController = require('../Controllers/Professor/authProfessorController');

const authProfessorMiddleware = require("../Middlawares/Professor/authProfessorMiddleware")
const {professorSchema} = require("../Middlawares/schemas/professorSchema")

const atribuirNotaProfessorMiddleware = require("../Middlawares/Professor/atribuirNotaProfessorMiddleware")
const {atribuirNotaParamsSchema, atribuirNotaBodySchema} = require("../Middlawares/schemas/professorSchema")

const router = express.Router();

router.post("/login",authProfessorMiddleware(professorSchema), AuthProfessorController.Login)

router.get("/trabalhos/:id", ProfessorController.TrabalhosPorProfessor)
router.get('/localizacao/:trabalhoId/', ProfessorController.LocalizacaoTrabalho);

router.get("/nota/:professor_id", ProfessorController.NotaAluno)


router.post('/nota/aluno/:alunoId/trabalho/:trabalhoId',atribuirNotaProfessorMiddleware({params:atribuirNotaParamsSchema, body:atribuirNotaBodySchema}), ProfessorController.AtribuirNota);





module.exports = router;