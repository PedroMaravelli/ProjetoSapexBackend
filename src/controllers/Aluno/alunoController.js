const AlunoService = require('../../services/AlunoService');
const ResponseHelper = require('../../utils/ResponseHelper');
const { MESSAGES } = require('../../constants');

const AlunoController = {
    TodosTrabalhos: async (req, res) => {
        try {
            const trabalhos = await AlunoService.obterTodosTrabalhos();
            return ResponseHelper.success(res, trabalhos);
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, 'Erro ao buscar trabalhos.');
        }
    },
    MeusTrabalhos: async (req, res) => {
        const { aluno_email } = req.params;

        try {
            const trabalhos = await AlunoService.obterMeusTrabalhos(aluno_email);
            
            if (trabalhos === null) {
                return ResponseHelper.notFound(res, 'Aluno não encontrado.');
            }

            return ResponseHelper.success(res, trabalhos);
        } catch (error) {
            console.error('Erro ao buscar trabalhos:', error);
            return ResponseHelper.error(res, 'Erro ao buscar trabalhos do aluno.');
        }
    },

    NotaAluno: async (req, res) => {
        const token = req.params.token;
        
        if (!token) {
            return ResponseHelper.badRequest(res, 'Token não fornecido.');
        }

        try {
            const resultado = await AlunoService.obterNotaAluno(token);
            
            if (!resultado) {
                return ResponseHelper.notFound(res, 'Associação não encontrada.');
            }

            return ResponseHelper.success(res, resultado);
        } catch (error) {
            console.error('Erro ao buscar nota:', error);
            return ResponseHelper.error(res, 'Erro ao buscar nota do aluno.');
        }
    },
    ComentariosTrabalho: async (req,res) => {
        try {
            const { trabalho_id } = req.params;

            if (!trabalho_id) {
                return ResponseHelper.badRequest(res, "ID do trabalho não fornecido");
            }
            const comentarios = await AlunoService.obterComentariosTrabalho(trabalho_id);

            return ResponseHelper.success(res, comentarios);
        } catch (error) {
            return ResponseHelper.error(res, "Erro ao buscar comentários");
        }
    }
}

module.exports = AlunoController;  