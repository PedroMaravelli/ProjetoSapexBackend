const { Admin } = require("../../database/models");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const AuthAdminController = {
    login: async (req, res) => {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
            }

            const admin = await Admin.findOne({
                where: { email }
            });

            if (!admin) {
                return res.status(401).json({ message: 'Usuário não encontrado.' });
            }

            const senhaValida = await bcrypt.compare(senha, admin.senha); 

            if (!senhaValida) {
                return res.status(401).json({ message: 'Senha incorreta.' });
            }

            const payload = {
                id: admin.id,
                email: admin.email,
                nome: admin.nome, 
                role: 'admin' 
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET, 
                {
                    expiresIn: process.env.JWT_EXPIRES_IN || '7d', 
                }
            );

            const { senha: _, ...adminSemSenha } = admin.toJSON();
            return res.status(200).json({
            message: 'Login realizado com sucesso!',
            admin: adminSemSenha,
            token: token,
            
        });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao fazer login.' });
        }
    },
    alterarSenha: async (req, res) => {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
            }

            const admin = await Admin.findOne({ where: { email } });

            if (!admin) {
                return res.status(404).json({ message: 'Admin não encontrado.' });
            }

            const hashSenha = await hash(senha, 10);

            await Admin.update({ hashSenha }, { where: { email } });

            return res.status(200).json({ message: 'Senha alterada com sucesso.' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao alterar a senha.' });
        }
    },
}

module.exports = AuthAdminController;  
