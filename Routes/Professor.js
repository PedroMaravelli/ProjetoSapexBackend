const express = require('express');
const ProfessorController = require('../Controllers/Professor/professorController');
const router = express.Router();

router.get("/login", ProfessorController.Login)
router.get("/trabalhos/:id", ProfessorController.TrabalhosPorProfessor)
router.get('/localizacao/:trabalhoId/', ProfessorController.LocalizacaoTrabalho);

// PUT /professor/nota/aluno/:alunoId/trabalho/:trabalhoId
router.put('/nota/aluno/:alunoId/trabalho/:trabalhoId', ProfessorController.AtribuirNota);





module.exports = router;