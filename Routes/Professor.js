const express = require('express');
const ProfessorController = require('../Controllers/Professor/professorController');
const router = express.Router();

router.post("/login", ProfessorController.Login)

router.get("/trabalhos/:id", ProfessorController.TrabalhosPorProfessor)
router.get('/localizacao/:trabalhoId/', ProfessorController.LocalizacaoTrabalho);

router.get("/nota/:professor_id", ProfessorController.NotaAluno)


// PUT /professor/nota/aluno/:alunoId/trabalho/:trabalhoId
router.post('/nota/aluno/:alunoId/trabalho/:trabalhoId', ProfessorController.AtribuirNota);





module.exports = router;