const express = require('express');
const router = express.Router();

const ProfessorController = require('../controllers/Professor/professorController');
const gerarTokenController = require('../controllers/Professor/GerarTokenRequest/gerarTokenController');

const atribuirNotaProfessorMiddleware = require("../middlewares/Professor/atribuirNotaProfessorMiddleware")
const {atribuirNotaParamsSchema, atribuirNotaBodySchema} = require("../validators/professorValidators")


router.get('/:email', ProfessorController.GetProfessor);
router.get("/trabalhos/:email", ProfessorController.TrabalhosPorProfessor)
router.get('/localizacao/:token', ProfessorController.LocalizacaoTrabalho);
router.get("/nota/:token", ProfessorController.NotaAluno)
router.get("/trabalhos/avaliados/:email", ProfessorController.TrabalhosAvaliados)


router.get("/avaliacao/gerartoken/:aluno_id/:trabalho_id", gerarTokenController.GerarTokenAvaliacao)
router.get("/nota/gerartoken/:email_aluno/:trabalho_id", gerarTokenController.GerarTokenNota)
router.get("/local/gerartoken/:trabalho_id", gerarTokenController.GerarTokenLocal)



router.post('/nota/aluno/:alunoId/trabalho/:trabalhoId',atribuirNotaProfessorMiddleware({params:atribuirNotaParamsSchema, body:atribuirNotaBodySchema}), ProfessorController.AtribuirNota);

router.put('/nota/aluno/:alunoId/trabalho/:trabalhoId',atribuirNotaProfessorMiddleware({params:atribuirNotaParamsSchema, body:atribuirNotaBodySchema}), ProfessorController.EditarNota)





module.exports = router;