const { Professor, Trabalho, AlunoHasTrabalho, Localizacao, Aluno } = require("../../database/models");



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
        
                return res.status(200).json({ message: "Login bem-sucedido", id: professor.id, });
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
                    as:"Professor"
                    
                },
                {
                    model: Aluno, 
                    as:"alunos"
                    
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
        const { alunoId, trabalhoId } = req.params;
        const { nota, justificativa_nota } = req.body;

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
    NotaAluno: async (req,res) =>{
       const { professor_id } = req.params;

try {
    const relacoes = await AlunoHasTrabalho.findAll({
        where: {
            nota: null
        },
        include: [
            {
                model: Trabalho,
                as: 'trabalho',
                where: { professor_id }
            },
            {
                model: Aluno,
                as: 'aluno'
            }
        ]
    });

    if (!relacoes || relacoes.length === 0) {
        return res.status(404).json({ message: 'Nenhuma relação pendente encontrada para esse professor.' });
    }

    // Agrupar trabalhos com seus respectivos alunos
    const trabalhosMap = {};

    relacoes.forEach(relacao => {
        const trabalhoId = relacao.trabalho.id;

        if (!trabalhosMap[trabalhoId]) {
            trabalhosMap[trabalhoId] = {
                trabalho: relacao.trabalho,
                alunos: []
            };
        }

        trabalhosMap[trabalhoId].alunos.push({
            id: relacao.aluno.id,
            nome: relacao.aluno.nome,
            email: relacao.aluno.email,
            ra: relacao.aluno.ra,
            turma: relacao.aluno.turma
        });
    });

    const resultado = Object.values(trabalhosMap);

    res.json(resultado);
} catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ message: 'Erro ao buscar trabalhos pendentes do professor.' });
}

            },
    LocalizacaoTrabalho: async (req,res) => {
        try {
            const trabalhoId = req.params.trabalhoId;

            // Buscando o trabalho com o id fornecido
            const trabalho = await Trabalho.findOne({
            where: { id: trabalhoId },
            include: {
                model: Localizacao,
                as:"Localizacao", // Incluindo a tabela de Localizacao
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