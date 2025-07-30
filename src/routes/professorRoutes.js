const express = require('express');
const router = express.Router();

const ProfessorController = require('../controllers/Professor/professorController');


const atribuirNotaProfessorMiddleware = require("../middlawares/Professor/atribuirNotaProfessorMiddleware")
const {atribuirNotaParamsSchema, atribuirNotaBodySchema} = require("../middlawares/schemas/professorSchema")


router.get("/trabalhos/:id", ProfessorController.TrabalhosPorProfessor)
router.get('/localizacao/:trabalhoId/', ProfessorController.LocalizacaoTrabalho);
router.get("/nota/:professor_id", ProfessorController.NotaAluno)

router.post('/nota/aluno/:alunoId/trabalho/:trabalhoId',atribuirNotaProfessorMiddleware({params:atribuirNotaParamsSchema, body:atribuirNotaBodySchema}), ProfessorController.AtribuirNota);





module.exports = router;