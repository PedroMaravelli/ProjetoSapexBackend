const { Trabalho, Aluno, Professor, Localizacao, Admin, GuiaSapex } = require('../../database/models');  // Importando todos os modelos necessários


const AdminController = {
    CadastroTrabalhos: async (req, res) => {
        try {
            const { titulo, tipo, n_poster, data, horario } = req.body;
        
            
            if (!titulo || !tipo || !n_poster || !data || !horario) {
              return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
            }
        
            const novoTrabalho = await Trabalho.create({
                titulo,
                tipo,
                n_poster,
                data,
                horario
            });
        
            return res.status(201).json({ mensagem: 'Trabalho criado com sucesso.', trabalho: novoTrabalho });
        } catch (erro) {
            console.error('Erro ao criar trabalho:', erro);
            return res.status(500).json({ mensagem: 'Erro interno ao criar trabalho.' });
        }
    },

    ListaTrabalhos: async (req, res) => {
        try {
            // Buscando todos os trabalhos com seus relacionamentos
            const trabalhos = await Trabalho.findAll({
                include: [
                    { model: Aluno, attributes: ['id', 'nome'] },
                    { model: Professor, attributes: ['id', 'nome'] },
                    { model: Localizacao, attributes: ['id', 'predio'] },
                    { model: Admin, attributes: ['id', 'nome'] }
                ]
            });
    
            // Retorno de sucesso
            return res.status(200).json(trabalhos);
        } catch (error) {
            // Caso haja erro
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
        
            
            if (!titulo || !descricao ) {
              return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
            }
        
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
    
            // Retorno de sucesso
            return res.status(200).json(guias);
        } catch (error) {
            // Caso haja erro
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
    }
};

module.exports = AdminController;  // Exportando o controlador de forma correta
