const { InteracoesTrabalhoService } = require("../../services");
const { ResponseHelper } = require("../../utils");

const InteracoesTrabalhoController = {
    ComentariosTrabalho: async (req, res) => {
        try {
            const { trabalho_id } = req.params;

            if (!trabalho_id) {
                return ResponseHelper.badRequest(res, "ID do trabalho não fornecido");
            }
            
            const resultado = await InteracoesTrabalhoService.obterComentariosTrabalho(trabalho_id);
            
            if (resultado.error) {
                return ResponseHelper.notFound(res, resultado.error);
            }

            return ResponseHelper.success(res, resultado);
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, "Erro ao buscar comentários");
        }
    },
    PostarComentario: async (req, res) => {
        try {
            const { trabalho_id, aluno_email, comentario } = req.body;
            
            if (!trabalho_id || !aluno_email || !comentario) {
                return ResponseHelper.badRequest(res, "Dados incompletos");
            }
            
            const resultado = await InteracoesTrabalhoService.CriarComentario(trabalho_id, aluno_email, comentario);
            
            if (resultado.error) {
                return ResponseHelper.badRequest(res, resultado.error);
            }
            
            return ResponseHelper.created(res, resultado, "Comentário criado com sucesso");
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, "Erro ao postar comentário");
        }
    },
    DeletarComentario: async (req,res) => {
        try {
            const { comentario_id, aluno_email } = req.body;

            if (!comentario_id || !aluno_email) {
                return ResponseHelper.badRequest(res, "Dados incompletos");
            }

            const comentarioDeletado = await InteracoesTrabalhoService.ExcluirComentario(comentario_id, aluno_email)

            if (comentarioDeletado.error) {
                return ResponseHelper.badRequest(res, comentarioDeletado.error);
            }

            return ResponseHelper.success(res, comentarioDeletado, "Comentário deletado com sucesso");
            
        } catch (error) {
            return ResponseHelper.error(res, "Erro ao deletar comentário");
        }
    },
    CurtirComentario: async (req, res) => {
        try {
            const { comentario_id, aluno_email } = req.body;

            if (!comentario_id || !aluno_email) {
                return ResponseHelper.badRequest(res, "Dados incompletos");
            }

            const resultado = await InteracoesTrabalhoService.CurtirComentario(comentario_id, aluno_email);


            return ResponseHelper.success(res, resultado, "Comentário curtido com sucesso");
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, "Erro ao curtir comentário");
        }
    },
    CurtirTrabalho: async (req,res) => {
        try {
            const { trabalho_id, aluno_email } = req.body;

            if (!trabalho_id || !aluno_email) {
                return ResponseHelper.badRequest(res, "Dados incompletos");
            }

            const trabalhoCurtido = await InteracoesTrabalhoService.LikeTrabalho(trabalho_id, aluno_email);

            if(trabalhoCurtido.error){
                return ResponseHelper.badRequest(res, trabalhoCurtido.error);
            }
            return ResponseHelper.success(res, trabalhoCurtido, "Trabalho curtido com sucesso");
        } catch (error) {
            return ResponseHelper.error(res, "Erro ao curtir trabalho");
        }
    }
}

module.exports = InteracoesTrabalhoController;