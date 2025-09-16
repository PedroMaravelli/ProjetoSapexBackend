const { z } = require("zod");

const atribuirNotaBodySchema = z.object({
    nota: z.number().min(0, "Nota deve ser no mínimo 0").max(10, "Nota deve ser no máximo 10"),
    justificativa_nota: z.string().optional()
});

const atribuirNotaParamsSchema = z.object({
    alunoId: z.string().min(1, "ID do aluno é obrigatório"),
    trabalhoId: z.string().min(1, "ID do trabalho é obrigatório")
});

module.exports = {
    atribuirNotaBodySchema,
    atribuirNotaParamsSchema
};