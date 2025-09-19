const TokenService = require('../../../services/TokenService');
const ResponseHelper = require('../../../utils/ResponseHelper');

const gerarTokenController = {
    GerarToken: async (req, res) => {
        const { aluno_email, trabalho_id } = req.params;
        
        if (!aluno_email || !trabalho_id) {
            return ResponseHelper.badRequest(res, 'Parâmetros insuficientes.');
        }
        
        const token = TokenService.gerarTokenAluno(aluno_email, trabalho_id);
        return ResponseHelper.success(res, { token });
    },

    GerarTokenViewLocal: async (req, res) => {
        const { trabalho_id } = req.params;
        
        if (!trabalho_id) {
            return ResponseHelper.badRequest(res, 'Parâmetros insuficientes.');
        }
        
        const token = TokenService.gerarTokenViewLocal(trabalho_id);
        return ResponseHelper.success(res, { token });
    },
}

module.exports = gerarTokenController;  