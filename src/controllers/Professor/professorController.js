const ProfessorService = require('../../services/ProfessorService');
const ResponseHelper = require('../../utils/ResponseHelper');
const { MESSAGES } = require('../../constants');

const ProfessorController = {
    TrabalhosPorProfessor: async (req, res) => {
        try {
            const emailProfessor = req.params.email;
            const trabalhos = await ProfessorService.obterTrabalhosPorProfessor(emailProfessor);

            if (trabalhos === null) {
                return ResponseHelper.notFound(res, 'Professor não encontrado.');
            }

            return ResponseHelper.success(res, trabalhos);
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, 'Erro ao buscar os trabalhos.');
        }
    },
    GetProfessor: async (req, res) => {
        try {
            const email = req.params.email;
            const professor = await ProfessorService.obterProfessor(email);

            if (!professor) {
                return ResponseHelper.notFound(res, 'Professor não encontrado.');
            }

            return ResponseHelper.success(res, professor);
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, 'Erro ao buscar o professor.');
        }
    },
    AtribuirNota: async (req, res) => {
        try {
            const { alunoId, trabalhoId } = req.params;
            const { nota, justificativa_nota } = req.body;

            if (typeof nota !== 'number' || nota < 0 || nota > 10) {
                return ResponseHelper.badRequest(res, 'Nota inválida. Deve estar entre 0 e 10.');
            }

            const success = await ProfessorService.atribuirNota(alunoId, trabalhoId, nota, justificativa_nota);

            if (!success) {
                return ResponseHelper.notFound(res, 'Associação aluno/trabalho não encontrada.');
            }

            return ResponseHelper.success(res, null, 'Nota atribuída com sucesso.');
        } catch (error) {
            console.error('Erro ao atribuir nota:', error);
            return ResponseHelper.error(res, 'Erro interno ao atribuir nota.');
        }
    },
    TrabalhosAvaliados: async (req, res) => {
        try {
            const emailProfessor = req.params.email;
            const trabalhos = await ProfessorService.obterTrabalhosAvaliados(emailProfessor);

            if (trabalhos === null) {
                return ResponseHelper.notFound(res, 'Professor não encontrado.');
            }

            return ResponseHelper.success(res, trabalhos);
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, 'Erro ao buscar os trabalhos.');
        }
    },
    NotaAluno: async (req, res) => {
        const token = req.params.token;
        
        if (!token) {
            return ResponseHelper.badRequest(res, 'Token não fornecido.');
        }

        try {
            const resultado = await ProfessorService.obterNotaAluno(token);
            
            if (!resultado) {
                return ResponseHelper.notFound(res, 'Associação não encontrada.');
            }

            return ResponseHelper.success(res, resultado);
        } catch (error) {
            console.error('Erro ao buscar nota:', error);
            
            if (error.message.includes('obrigatórios')) {
                return ResponseHelper.badRequest(res, error.message);
            }
            
            return ResponseHelper.error(res, 'Erro ao buscar nota do aluno.');
        }
    },
    LocalizacaoTrabalho: async (req, res) => {
        try {
            const token = req.params.token;
            
            if (!token) {
                return ResponseHelper.badRequest(res, 'Token não fornecido.');
            }

            const localizacao = await ProfessorService.obterLocalizacaoTrabalho(token);

            if (!localizacao) {
                return ResponseHelper.notFound(res, 'Trabalho não encontrado.');
            }

            return ResponseHelper.success(res, localizacao);
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, 'Erro ao buscar a localização.');
        }
    },
    EditarNota: async (req,res) => {
        try {
            const { alunoId, trabalhoId } = req.params;
            const { nota, justificativa_nota } = req.body;

            const atualizarNota = await ProfessorService.editarNota(alunoId, trabalhoId, nota, justificativa_nota);
            
            if (!atualizarNota) {
                return ResponseHelper.notFound(res, 'Associação aluno/trabalho não encontrada.');
            }

            return ResponseHelper.success(res, atualizarNota, 'Nota editada com sucesso!!!');
        } catch (error) {
            console.log(error);
            return ResponseHelper.error(res, 'Erro ao editar a nota!!!');
        }
    }

}


module.exports = ProfessorController;  