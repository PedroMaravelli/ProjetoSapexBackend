const AuthService = require('../../services/AuthService');
const ResponseHelper = require('../../utils/ResponseHelper');
const { MESSAGES } = require('../../constants');

const AuthAdminController = {
    login: async (req, res) => {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return ResponseHelper.badRequest(res, 'Email e senha são obrigatórios.');
            }

            const result = await AuthService.loginAdmin(email, senha);

            if (!result) {
                return ResponseHelper.badRequest(res, 'Usuário não encontrado.');
            }

            if (result.error) {
                return ResponseHelper.badRequest(res, result.error);
            }

            return ResponseHelper.success(res, {
                message: 'Login realizado com sucesso!',
                admin: result.admin,
                token: result.token
            });
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, 'Erro ao fazer login.');
        }
    },
    alterarSenha: async (req, res) => {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return ResponseHelper.badRequest(res, 'Email e senha são obrigatórios.');
            }

            const admin = await AuthService.alterarSenhaAdmin(email, senha);

            if (!admin) {
                return ResponseHelper.notFound(res, 'Admin não encontrado.');
            }

            return ResponseHelper.success(res, null, 'Senha alterada com sucesso.');
        } catch (error) {
            return ResponseHelper.error(res, 'Erro ao alterar a senha.');
        }
    },
}

module.exports = AuthAdminController;  
