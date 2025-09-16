const TokenService = require('../../../services/TokenService');
const ResponseHelper = require('../../../utils/ResponseHelper');

const gerarTokenController = {
    GerarTokenAvaliacao: async (req, res) => {
        const { aluno_id, trabalho_id } = req.params;
        
        if (!aluno_id || !trabalho_id) {
            return ResponseHelper.badRequest(res, 'Parâmetros insuficientes.');
        }
        
        const token = TokenService.gerarTokenAvaliacao(aluno_id, trabalho_id);
        return ResponseHelper.success(res, { token });
    },

    GerarTokenNota: async (req, res) => {
        const { email_aluno, trabalho_id } = req.params;

        if (!email_aluno || !trabalho_id) {
            return ResponseHelper.badRequest(res, 'Parâmetros insuficientes.');
        }
        
        const token = TokenService.gerarTokenNota(email_aluno, trabalho_id);
        return ResponseHelper.success(res, { token });
    },

    GerarTokenLocal: async (req, res) => {
        const { trabalho_id } = req.params;
        
        if (!trabalho_id) {
            return ResponseHelper.badRequest(res, 'Parâmetros insuficientes.');
        }
        
        const token = TokenService.gerarTokenLocal(trabalho_id);
        return ResponseHelper.success(res, { token });
    }
}

module.exports = gerarTokenController;