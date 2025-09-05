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
                    ra: aluno.ra,
                    turma: req.body.turma || 'não informado',
                    senha: '123456' // senha padrão
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
        try {

            const trabalhos = await Trabalho.findAll({
                include: [
                    
                    { model: Professor, as: "Professor",attributes: ['id', 'nome'] },
                    { model: Localizacao, as: "Localizacao", attributes: ['id', 'predio'] },
                
                ]
            });
    
            return res.status(200).json(trabalhos);
        } catch (error) {

            console.error(error);
            return res.status(500).json({
                mensagem: 'Erro ao listar os trabalhos.',
                erro: error.message
            });
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
    };

module.exports = AdminController;  
