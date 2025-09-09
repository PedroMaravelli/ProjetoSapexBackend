const { Op } = require("sequelize");
const { Professor, Trabalho, AlunoHasTrabalho, Localizacao, Aluno } = require("../../database/models");



const ProfessorController = {
    TrabalhosPorProfessor: async (req, res) => {
        try {
        
        const email_professor  = req.params.email;

        const professor = await Professor.findOne({ where: { email: email_professor } });

        if (!professor) {
            return res.status(404).json({ message: 'Professor não encontrado.' });
        }

        
        const trabalhos = await Trabalho.findAll({
            where: { professor_id: professor.id }, 
            include: [
                {
                    model: Professor, 
                    as:"Professor"
                    
                },
                {
                    model: Aluno, 
                    as:"alunos",
                    through: {
                        attributes: ['nota', 'justificativa_nota']
                    }
                    
                }
            ]
        });

        
        if (trabalhos.length === 0) {
            return res.status(404).json({ message: 'Nenhum trabalho encontrado para este professor.' });
        }

        const trabalhosPendentes = trabalhos.map(trabalho => {
            const trabalhoObj = trabalho.toJSON();
            trabalhoObj.alunos = trabalhoObj.alunos.filter(aluno => aluno.aluno_has_trabalho.nota === null);
            return trabalhoObj;
        }).filter(trabalho => trabalho.alunos.length > 0);
        
        return res.status(200).json(trabalhosPendentes);
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
    TrabalhosAvaliados: async (req, res) => {
        try {
            const email_professor = req.params.email;

            const professor = await Professor.findOne({ where: { email: email_professor } });

            if (!professor) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }

            const trabalhos = await Trabalho.findAll({
                where: {
                    professor_id: professor.id
                },
                include: [
                    {
                        model: Professor,
                        as: "Professor"
                    },
                    {
                        model: Aluno,
                        as: "alunos",
                        through: {
                            attributes: ['nota', 'justificativa_nota']
                        }
                    }
                ]
            });

            if (trabalhos.length === 0) {
                return res.status(404).json({ message: 'Nenhum trabalho encontrado para este professor.' });
            }

            const trabalhosLimpos = trabalhos.map(trabalho => {
                const trabalhoObj = trabalho.toJSON();
                trabalhoObj.alunos = trabalhoObj.alunos.filter(aluno => aluno.aluno_has_trabalho.nota !== null);
                return trabalhoObj;
            }).filter(trabalho => trabalho.alunos.length > 0);

            return res.status(200).json(trabalhosLimpos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar os trabalhos.' });
        }
    },
    NotaAluno: async (req,res) => {
        const jwt = require('jsonwebtoken');
        const token = req.params.token;
        
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido.' });
        }
        

        try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email_aluno, trabalho_id } = decoded;


        if (!email_aluno || !trabalho_id) {
            return res.status(400).json({ 
                message: 'Email do aluno e ID do trabalho são obrigatórios.'
            });
        }
        
        const aluno = await Aluno.findOne({ 
            where: { 
                email: email_aluno 
            }
        });
        

        if (!aluno) {
            return res.status(404).json({
                message: 'Aluno não encontrado com o email fornecido.'
            });
        }

        const relacao = await AlunoHasTrabalho.findOne({
            where: {
                aluno_id: aluno.id,
                trabalho_id,
                
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
    },
    LocalizacaoTrabalho: async (req,res) => {
        try {
            const jwt = require('jsonwebtoken');
            const token = req.params.token
            
            if (!token) {
                return res.status(401).json({ message: 'Token não fornecido.' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { trabalho_id } = decoded;
            const trabalhoId = trabalho_id;



            const trabalho = await Trabalho.findOne({
            where: { id: trabalhoId },
            include: {
                model: Localizacao,
                as:"Localizacao", 
                required: true 
            }
            });


            if (!trabalho) {
            return res.status(404).json({ message: 'Trabalho não encontrado.' });
            }


            return res.json(trabalho.Localizacao);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar a localização.', error });
        }
    },

}


module.exports = ProfessorController;  