const { Professor, Trabalho, AlunoHasTrabalho, Localizacao } = require("../../database/models");



const ProfessorController = {
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
        
                return res.status(200).json({ message: "Login bem-sucedido" });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Erro no servidor" });
            }
        
    },
    TrabalhosPorProfessor: async (req, res) => {
        try {
        
        const professorId = req.params.id;

        
        const trabalhos = await Trabalho.findAll({
            where: { professor_id: professorId }, 
            include: [
                {
                    model: Professor, 
                    
                }
            ]
        });

        
        if (trabalhos.length === 0) {
            return res.status(404).json({ message: 'Nenhum trabalho encontrado para este professor.' });
        }

        
        return res.status(200).json(trabalhos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar os trabalhos.' });
    }

    },
    AtribuirNota: async(req, res) => {
    try {
        const { alunoId, trabalhoId, justificativa_nota } = req.params;
        const { nota } = req.body;

        if (typeof nota !== 'number' || nota < 0 || nota > 10) {
            return res.status(400).json({ message: 'Nota inválida. Deve estar entre 0 e 10.' });
        }

        const [updated] = await AlunoHasTrabalho.update(
            { nota, justificativa_nota },
            { where: { aluno_id: alunoId, trabalho_id: trabalhoId } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Associação aluno/trabalho não encontrada.' });
        }

        return res.status(200).json({ message: 'Nota atribuída com sucesso.' });
    } catch (error) {
        console.error('Erro ao atribuir nota:', error);
        return res.status(500).json({ message: 'Erro interno ao atribuir nota.' });
    }
},
    LocalizacaoTrabalho: async (req,res) => {
        try {
            const trabalhoId = req.params.trabalhoId;

            // Buscando o trabalho com o id fornecido
            const trabalho = await Trabalho.findOne({
            where: { id: trabalhoId },
            include: {
                model: Localizacao, // Incluindo a tabela de Localizacao
                required: true // Isso garante que a localização será encontrada
            }
            });

            // Se o trabalho não for encontrado, retorna um erro
            if (!trabalho) {
            return res.status(404).json({ message: 'Trabalho não encontrado.' });
            }

            // Retorna a localização associada ao trabalho
            return res.json(trabalho.Localizacao);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar a localização.', error });
  }
    }

    }
    


module.exports = ProfessorController;  