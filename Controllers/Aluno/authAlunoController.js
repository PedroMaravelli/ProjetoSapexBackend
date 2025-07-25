const { Aluno } = require("../../database/models");

const authAlunoController = {
    login: async (req, res) =>{
                try {
                    const { email, senha } = req.body;
            
                    
                    const aluno = await Aluno.findOne({ where: { email } });
            
                    if (!aluno) {
                    return res.status(400).json({ message: "Usuário não encontrado" });
                    }
            
                    
                    if (senha !== aluno.senha) {
                    return res.status(400).json({ message: "Senha incorreta" });
                    }
            
                    return res.status(200).json({ message: "Login bem-sucedido" , id: aluno.id,});
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Erro no servidor" });
                }
    
        },
}

module.exports = authAlunoController