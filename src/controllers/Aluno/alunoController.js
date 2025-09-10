const { Op } = require("sequelize");
const { Aluno, Trabalho, AlunoHasTrabalho, Professor, Localizacao } = require("../../database/models");


const AlunoController = {
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
            
            return res.json(trabalhos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar trabalhos.' });
        }
            },
    MeusTrabalhos: async (req,res) =>{
        const { aluno_email } = req.params;

        try {
            const aluno = await Aluno.findOne({ where: { email: aluno_email } });
            
        
            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            const trabalhos = await AlunoHasTrabalho.findAll({
                where: { aluno_id: aluno.id },
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

            const resultado = trabalhos.map(item => item.trabalho);

            res.json(resultado);
        } catch (error) {
            console.error('Erro ao buscar trabalhos:', error);
            res.status(500).json({ message: 'Erro ao buscar trabalhos do aluno.' });
        }
            },

    NotaAluno: async (req,res) =>{
        const jwt = require('jsonwebtoken');
        const token = req.params.token
        
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { aluno_email, trabalho_id } = decoded;

            const aluno = await Aluno.findOne({ where: { email: aluno_email } });
            
            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            const relacao = await AlunoHasTrabalho.findOne({
            where: {
                aluno_id: aluno.id,
                trabalho_id
            },
            include: [
                {
                model: Trabalho,
                as: 'trabalho'
                },
                {
                model: Aluno,
                as: 'aluno'
                }
            ]
            });

            if (!relacao) {
            return res.status(404).json({ message: 'Associação não encontrada.' });
            }

            const resultado = {
            nota: relacao.nota,
            justificativa_nota: relacao.justificativa_nota,
            trabalho: relacao.trabalho,
            aluno: relacao.aluno
            };

            res.json(resultado);
        } catch (error) {
            console.error('Erro ao buscar nota:', error);
            res.status(500).json({ message: 'Erro ao buscar nota do aluno.' });
        }
            }
}

module.exports = AlunoController;  