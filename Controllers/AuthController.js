const passport = require('passport');
const JwtService = require('../config/jwtConfig');
const UserService = require('../config/userService');
const { Aluno, Professor } = require('../database/models');

class AuthController {
    static initiateGoogleAuth(req, res, next) {
        passport.authenticate('google', {
        scope: ['profile', 'email'],
        hd: 'fsa.br' // Restringe ao domínio da instituição
        })(req, res, next);
    }

    static async handleGoogleCallback(req, res, next) {
        passport.authenticate('google', { session: false }, async (err, user) => {
        try {
            if (err) {
            console.error('Erro na autenticação:', err);
            return res.status(500).json({
                error: 'Erro interno durante autenticação',
                message: 'Tente novamente mais tarde'
            });
            }

            if (!user) {
            return res.status(401).json({
                error: 'Falha na autenticação',
                message: 'Não foi possível autenticar com o Google'
            });
            }

            // Validar se o email é institucional
            if (!UserService.validateInstitutionalEmail(user.email)) {
            return res.status(403).json({
                error: 'Acesso negado',
                message: 'Apenas emails institucionais são permitidos (@graduacao.fsa.br ou @fsa.br)'
            });
            }

            // Formatar dados do usuário
            const userData = UserService.formatUserResponse(user);

            // Gerar token JWT
            const tokenPayload = {
            userId: user.googleId,
            email: user.email,
            role: userData.role,
            name: user.name
            };

            const token = JwtService.generateToken(tokenPayload);

            if(userData.role === 'professor'){
                const professor = await Professor.create({
                    nome: userData.name,
                    email: userData.email,
            });
            }
            if(userData.role === 'aluno'){
                const aluno = await Aluno.create({
                    nome: userData.name,
                    email: userData.email,
            });

            }
            

            // Resposta de sucesso
            return res.status(200).json({
            token: token,
            user: userData,
            message: 'Autenticação realizada com sucesso'
            });

        } catch (error) {
            console.error('Erro no callback:', error);
            
            if (error.message.includes('domínio institucional')) {
            return res.status(403).json({
                error: 'Acesso negado',
                message: error.message
            });
            }

            return res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Falha ao processar autenticação'
            });
        }
        })(req, res, next);
    }

    static async validateToken(req, res) {
        try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
            error: 'Token não fornecido',
            message: 'Acesso negado'
            });
        }

        const decoded = JwtService.verifyToken(token);
        
        return res.status(200).json({
            valid: true,
            user: {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
            }
        });

        } catch (error) {
        return res.status(401).json({
            error: 'Token inválido',
            message: error.message
        });
        }
    }
}

module.exports = AuthController