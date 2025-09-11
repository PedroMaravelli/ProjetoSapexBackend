const { Op } = require('sequelize');
const { Trabalho, Aluno, Professor, Localizacao, Admin, GuiaSapex, AlunoHasTrabalho } = require('../../database/models');  // Importando todos os modelos necessário



const AdminController = {
    CadastroTrabalhos: async (req, res) => {
        try {
        const { titulo, tipo, n_poster, data, horario, localizacao, professor, alunos } = req.body;

        const novaLocalizacao = await Localizacao.create({
            predio: localizacao.predio,
            sala: localizacao.sala,
            ponto_referencia: localizacao.ponto_referencia
        });


        let professorExistente = await Professor.findOne({ where: { email: professor.email } });

        if (!professorExistente) {
            professorExistente = await Professor.create({
                nome: professor.nome,
                email: professor.email,
            });
        }


        const novoTrabalho = await Trabalho.create({
            titulo,
            tipo,
            turma: req.body.turma || null,
            n_poster,
            data,
            horario,
            professor_id: professorExistente.id,
            localizacao_id: novaLocalizacao.id
        });

        for (const aluno of alunos) {

            let alunoExistente = await Aluno.findOne({ where: { email: aluno.email } });

            if (!alunoExistente) {
                alunoExistente = await Aluno.create({
                    nome: aluno.nome,
                    email: aluno.email,
                    turma: req.body.turma || 'não informado',
                });
            }

            await AlunoHasTrabalho.create({
                alunoId: alunoExistente.id,
                trabalhoId: novoTrabalho.id
            });
        }

        return res.status(201).json({ mensagem: 'Trabalho cadastrado com sucesso.', trabalho: novoTrabalho });

    } catch (erro) {
        console.error('Erro ao criar trabalho:', erro);
        return res.status(500).json({ mensagem: 'Erro interno ao criar trabalho.' });
    }
    },

    ListaTrabalhos: async (req, res) => {
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
    CadastroInstrucao: async (req,res) => {
        try {
            const { titulo, descricao } = req.body;
        
            const novaInstrucao = await GuiaSapex.create({
                titulo,
                descricao
            });
        
            return res.status(201).json({ mensagem: 'Trabalho criado com sucesso.', instrucao: novaInstrucao });
        } catch (erro) {
            console.error('Erro ao criar trabalho:', erro);
            return res.status(500).json({ mensagem: 'Erro interno ao criar trabalho.' });
        }
    

    },
    ListaInstrucao: async (req,res) => {
        try {
            
            const guias = await GuiaSapex.findAll()
    

            return res.status(200).json(guias);
        } catch (error) {

            console.error(error);
            return res.status(500).json({
                mensagem: 'Erro ao listar Intruções.',
                erro: error.message
            });
        }
    },
    CadastroLocalizacao: async (req,res) => {
        try {
            const { predio, sala, ponto_referencia } = req.body;
        
            
            if (!predio || !sala || !ponto_referencia ) {
                return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
            }
        
            const localizacao = await Localizacao.create({
                predio,
                sala,
                ponto_referencia
            });
        
            return res.status(201).json({ mensagem: 'Trabalho criado com sucesso.', local: localizacao });
        } catch (erro) {
            console.error('Erro ao criar trabalho:', erro);
            return res.status(500).json({ mensagem: 'Erro interno ao criar trabalho.' });
        }
    },
    InfosTrabalho: async (req,res) => {
        const { id } = req.params;

        try {
        const trabalho = await Trabalho.findByPk(id, {
            include: [
            {model: Aluno,
                as: "alunos", 
                through: { attributes: [] } },      
            { model: Professor, as: "Professor"},
            { model:Localizacao, as: 'Localizacao' },
            ],
        });

        if (!trabalho) {
            return res.status(404).json({ error: 'Trabalho não encontrado' });
        }

        return res.json(trabalho);
        } catch (error) {
        console.error('Erro ao buscar trabalho por ID:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        },
        DeletarGuiaSapex: async (req, res) => {
                const { id } = req.params;
        
                try {
                    const guia = await GuiaSapex.findByPk(id);
        
                    if (!guia) {
                        return res.status(404).json({ message: 'Guia não encontrada.' });
                    }
        
                    await guia.destroy();
        
                    return res.status(200).json({ message: 'Guia deletada com sucesso.' });
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Erro ao deletar a guia.' });
                }
            },
        DeletarTrabalho: async (req, res) => {
                const { id } = req.params;

                try {
                    const trabalho = await Trabalho.findByPk(id);

                    if (!trabalho) {
                        return res.status(404).json({ message: 'Trabalho não encontrado.' });
                    }

                    await trabalho.destroy();

                    return res.status(200).json({ message: 'Trabalho deletado com sucesso.' });
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Erro ao deletar o trabalho.' });
                }
            },
        EditarTrabalho: async (req, res) => {
                const { id } = req.params;
                const { titulo, tipo, n_poster, data, horario, localizacao, professor, alunos } = req.body;

                try {
                    const trabalho = await Trabalho.findByPk(id);

                    if (!trabalho) {
                        return res.status(404).json({ message: 'Trabalho não encontrado.' });
                    }

                    // Atualizar localização
                    if (localizacao) {
                        await Localizacao.update(
                            {
                                predio: localizacao.predio,
                                sala: localizacao.sala,
                                ponto_referencia: localizacao.ponto_referencia
                            },
                            { where: { id: trabalho.localizacao_id } }
                        );
                    }

                    // Atualizar professor
                    if (professor) {
                        let professorExistente = await Professor.findOne({ where: { email: professor.email } });
                        
                        if (!professorExistente) {
                            professorExistente = await Professor.create({
                                nome: professor.nome,
                                email: professor.email,
                            });
                        } else {
                            await Professor.update(
                                { nome: professor.nome },
                                { where: { id: professorExistente.id } }
                            );
                        }
                        trabalho.professor_id = professorExistente.id;
                    }

                    // Atualizar alunos
                    if (alunos && alunos.length > 0) {
                        await AlunoHasTrabalho.destroy({ where: { trabalhoId: trabalho.id } });
                        
                        for (const aluno of alunos) {
                            let alunoExistente = await Aluno.findOne({ where: { email: aluno.email } });
                            
                            if (!alunoExistente) {
                                alunoExistente = await Aluno.create({
                                    nome: aluno.nome,
                                    email: aluno.email,
                                    turma: 'não informado',
                                });
                            }
                            
                            await AlunoHasTrabalho.create({
                                alunoId: alunoExistente.id,
                                trabalhoId: trabalho.id
                            });
                        }
                    }

                    // Atualizar campos do trabalho
                    trabalho.titulo = titulo;
                    trabalho.tipo = tipo;
                    trabalho.n_poster = n_poster;
                    trabalho.data = data;
                    trabalho.horario = horario;

                    await trabalho.save();

                    return res.status(200).json({ message: 'Trabalho atualizado com sucesso.', trabalho });
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Erro ao atualizar o trabalho.' });
                }
            },

    };

module.exports = AdminController;  
