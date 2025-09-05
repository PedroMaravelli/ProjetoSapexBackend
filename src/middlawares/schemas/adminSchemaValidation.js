// validations/adminSchema.js
const { z } = require("zod");

const localizaoSchema = z.object({
    predio: z.string(),
    sala: z.string(),
    ponto_referencia: z.string(),
})

const professorSchema = z.object({
    nome: z.string(),
    email: z.string().email(),
})
const alunosSchema = z.object({
    nome: z.string(),
    email: z.string(),
    turma: z.string().nullable(),
})
const cadastroTrabalhosAdminSchema = z.object({
    titulo: z.string().min(3, "Titulo deve ter ao menos 3 caracteres"),
    tipo: z.string(),
    n_poster: z.number(),
    data: z.string().or(z.date()),
    horario:z.string(),
    localizacao: z.array(localizaoSchema),
    professor:z.array(professorSchema),
    alunos:z.array(alunosSchema)

});


const cadastroGuiaSapexSchema = z.object({
    titulo: z.string(),
    descricao: z.string()

})



module.exports = {
    cadastroTrabalhosAdminSchema,
    cadastroGuiaSapexSchema
};
