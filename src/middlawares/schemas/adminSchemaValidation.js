// validations/adminSchema.js
const { z } = require("zod");

const alunoSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string()
        .email("Email inválido")
        .regex(/@graduacao\.fsa\.br$/, "Email deve terminar com @graduacao.fsa.br"),
});

const professorSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string()
        .email("Email inválido")
        .regex(/@fsa\.br$/, "Email deve terminar com @fsa.br"),
});

const localizacaoSchema = z.object({
    predio: z.string().min(1, "Prédio é obrigatório"),
    ponto_referencia: z.string().min(1, "Ponto de referência é obrigatório"),
});

const cadastroTrabalhosAdminSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório"),
    tipo: z.string().min(1, "Tipo é obrigatório"),
    data: z.string().min(1, "Data é obrigatória"),
    turma: z.string().min(1, "Turma é obrigatória"),
    horario: z.string().min(1, "Horário é obrigatório"),
    nomeProfessor: z.string().min(1, "Nome do professor é obrigatório"),
    emailProfessor: z.string()
        .email("Email inválido")
        .regex(/@fsa\.br$/, "Email deve terminar com @fsa.br"),
    n_poster: z.number(),
    localizacao: localizacaoSchema.optional(),
    professor: professorSchema.optional(),
    alunos: z.array(alunoSchema).nonempty("Adicione pelo menos um aluno")
});


const cadastroGuiaSapexSchema = z.object({
    titulo: z.string(),
    descricao: z.string()

})



module.exports = {
    cadastroTrabalhosAdminSchema,
    cadastroGuiaSapexSchema
};
