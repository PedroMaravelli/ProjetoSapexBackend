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
    sala: z.string().optional(),
    ponto_referencia: z.string().min(1, "Ponto de referência é obrigatório"),
});

const cadastroTrabalhosSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório"),
    tipo: z.string().min(1, "Tipo é obrigatório"),
    data: z.string().min(1, "Data é obrigatória"),
    turma: z.string().optional(),
    horario: z.string().min(1, "Horário é obrigatório"),
    n_poster: z.number(),
    localizacao: localizacaoSchema,
    professor: professorSchema,
    alunos: z.array(alunoSchema).nonempty("Adicione pelo menos um aluno")
});

const cadastroGuiaSapexSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório"),
    descricao: z.string().min(1, "Descrição é obrigatória")
});

const cadastroLocalizacaoSchema = z.object({
    predio: z.string().min(1, "Prédio é obrigatório"),
    sala: z.string().min(1, "Sala é obrigatória"),
    ponto_referencia: z.string().min(1, "Ponto de referência é obrigatório")
});

module.exports = {
    cadastroTrabalhosSchema,
    cadastroGuiaSapexSchema,
    cadastroLocalizacaoSchema
};