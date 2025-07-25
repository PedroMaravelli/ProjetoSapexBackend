const { Professor } = require("../../database/models");

const authProfessorController = {
    Login: async (req, res) => {
            try {
                    const { email, senha } = req.body;
            
                    
                    const professor = await Professor.findOne({ where: { email } });
            
                    if (!professor) {
                    return res.status(400).json({ message: "Usuário não encontrado" });
                    }
            
                    
                    if (senha !== professor.senha) {
                    return res.status(400).json({ message: "Senha incorreta" });
                    }
            
                    return res.status(200).json({ message: "Login bem-sucedido", id: professor.id, });
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Erro no servidor" });
                }
            
        },

}

module.exports = authProfessorController