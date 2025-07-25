const { z } = require("zod");

const professorSchema = z.object({
    senha: z.string().min(5),
    email:z.string().email().includes("@"),
})


const atribuirNotaParamsSchema = z.object({
  alunoId: z.string().regex(/^\d+$/, { message: "ID do aluno deve ser um número" }),
  trabalhoId: z.string().regex(/^\d+$/, { message: "ID do trabalho deve ser um número" }),
});

const atribuirNotaBodySchema = z.object({
  nota: z
    .number({ required_error: "Nota é obrigatória" })
    .min(0, { message: "Nota não pode ser menor que 0" })
    .max(10, { message: "Nota não pode ser maior que 10" }),

  justificativa_nota: z.string().nullable().optional(),
});


module.exports = {
    professorSchema,
    atribuirNotaParamsSchema,
    atribuirNotaBodySchema,
};
