const { Op } = require("sequelize");
const { Aluno, Trabalho, AlunoHasTrabalho, Professor } = require("../../database/models");

const AlunoController = {
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
    TodosTrabalhos: async (req,res) => {
        const anoAtual = new Date().getFullYear();

        try {
            const trabalhos = await Trabalho.findAll({
            where: {
                data: {
                [Op.gte]: new Date(`${anoAtual}-01-01`),
                [Op.lt]: new Date(`${anoAtual + 1}-01-01`)
                }
            },
            include: [
                {
                model: Aluno,
                as:"alunos"
                }
            ]
            });
            
            if (trabalhos.length > 0) {
            return res.json(trabalhos);
            } else {
            return res.status(404).json({ message: 'Nenhum trabalho encontrado para este ano.' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar trabalhos.' });
        }
            },
    MeusTrabalhos: async (req,res) =>{
         const { aluno_id } = req.params;

        try {
            const trabalhos = await AlunoHasTrabalho.findAll({
            where: { aluno_id },
            include: [
                {
                model: Trabalho,
                as: 'trabalho',
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
                }
            ]
            });

            if (trabalhos.length === 0) {
            return res.status(404).json({ message: 'Nenhum trabalho encontrado para este aluno.' });
            }

            // Retorna apenas os dados dos trabalhos
            const resultado = trabalhos.map(item => item.trabalho);

            res.json(resultado);
        } catch (error) {
            console.error('Erro ao buscar trabalhos:', error);
            res.status(500).json({ message: 'Erro ao buscar trabalhos do aluno.' });
        }
            },
    NotaAluno: async (req,res) =>{
        const { aluno_id, trabalho_id } = req.params;

        try {
            const relacao = await AlunoHasTrabalho.findOne({
            where: {
                aluno_id,
                trabalho_id
            },
            include: [
                {
                model: Trabalho,
                as: 'trabalho'
                }
            ]
            });

            if (!relacao) {
            return res.status(404).json({ message: 'Associação não encontrada.' });
            }

            const resultado = {
            nota: relacao.nota,
            justificativa_nota: relacao.justificativa_nota,
            trabalho: relacao.trabalho
            };

            res.json(resultado);
        } catch (error) {
            console.error('Erro ao buscar nota:', error);
            res.status(500).json({ message: 'Erro ao buscar nota do aluno.' });
        }
            }
}

module.exports = AlunoController;  