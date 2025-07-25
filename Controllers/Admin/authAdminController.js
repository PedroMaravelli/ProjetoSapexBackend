const { Admin } = require("../../database/models");

const authAdminController = {
    Login: async (req,res) => {
            try {
            const { email, senha } = req.body;
    
            
            const admin = await Admin.findOne({ where: { email } });
    
            if (!admin) {
            return res.status(400).json({ message: "Usuário não encontrado" });
            }
    
            
            if (senha !== admin.senha) {
            return res.status(400).json({ message: "Senha incorreta" });
            }
    
            return res.status(200).json({ message: "Login bem-sucedido" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro no servidor" });
        }
    }
}

module.exports = authAdminController;  
