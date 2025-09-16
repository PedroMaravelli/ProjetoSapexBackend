const AdminService = require('../../services/AdminService');
const ResponseHelper = require('../../utils/ResponseHelper');
const { MESSAGES } = require('../../constants');

const AdminController = {
    CadastroTrabalhos: async (req, res) => {
        try {
            const dadosTrabalho = req.validatedBody || req.body;
            const novoTrabalho = await AdminService.criarTrabalho(dadosTrabalho);
            
            return ResponseHelper.created(res, novoTrabalho, MESSAGES.SUCCESS.TRABALHO_CREATED);
        } catch (erro) {
            console.error('Erro ao criar trabalho:', erro);
            return ResponseHelper.error(res, MESSAGES.ERROR.INTERNAL_ERROR);
        }
    },

    ListaTrabalhos: async (req, res) => {
        try {
            const trabalhos = await AdminService.listarTrabalhos();
            return ResponseHelper.success(res, trabalhos);
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, 'Erro ao buscar trabalhos.');
        }
    },
    CadastroInstrucao: async (req, res) => {
        try {
            const dadosInstrucao = req.validatedBody || req.body;
            const novaInstrucao = await AdminService.criarInstrucao(dadosInstrucao);
            
            return ResponseHelper.created(res, novaInstrucao, MESSAGES.SUCCESS.GUIA_CREATED);
        } catch (erro) {
            console.error('Erro ao criar instrução:', erro);
            return ResponseHelper.error(res, MESSAGES.ERROR.INTERNAL_ERROR);
        }
    },
    ListaInstrucao: async (req, res) => {
        try {
            const guias = await AdminService.listarInstrucoes();
            return ResponseHelper.success(res, guias);
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, 'Erro ao listar instruções.');
        }
    },
    CadastroLocalizacao: async (req, res) => {
        try {
            const dadosLocalizacao = req.validatedBody || req.body;
            const localizacao = await AdminService.criarLocalizacao(dadosLocalizacao);
            
            return ResponseHelper.created(res, localizacao, MESSAGES.SUCCESS.LOCALIZACAO_CREATED);
        } catch (erro) {
            console.error('Erro ao criar localização:', erro);
            return ResponseHelper.error(res, MESSAGES.ERROR.INTERNAL_ERROR);
        }
    },
    InfosTrabalho: async (req, res) => {
        const { id } = req.params;

        try {
            const trabalho = await AdminService.obterInfosTrabalho(id);

            if (!trabalho) {
                return ResponseHelper.notFound(res, MESSAGES.ERROR.TRABALHO_NOT_FOUND);
            }

            return ResponseHelper.success(res, trabalho);
        } catch (error) {
            console.error('Erro ao buscar trabalho por ID:', error);
            return ResponseHelper.error(res, MESSAGES.ERROR.INTERNAL_ERROR);
        }
    },
    DeletarGuiaSapex: async (req, res) => {
        const { id } = req.params;

        try {
            const guia = await AdminService.deletarGuiaSapex(id);

            if (!guia) {
                return ResponseHelper.notFound(res, MESSAGES.ERROR.GUIA_NOT_FOUND);
            }

            return ResponseHelper.success(res, null, MESSAGES.SUCCESS.GUIA_DELETED);
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, 'Erro ao deletar a guia.');
        }
    },
    DeletarTrabalho: async (req, res) => {
        const { id } = req.params;

        try {
            const trabalho = await AdminService.deletarTrabalho(id);

            if (!trabalho) {
                return ResponseHelper.notFound(res, MESSAGES.ERROR.TRABALHO_NOT_FOUND);
            }

            return ResponseHelper.success(res, null, MESSAGES.SUCCESS.TRABALHO_DELETED);
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, 'Erro ao deletar o trabalho.');
        }
    },
    EditarTrabalho: async (req, res) => {
        const { id } = req.params;
        const dadosTrabalho = req.validatedBody || req.body;

        try {
            const trabalho = await AdminService.editarTrabalho(id, dadosTrabalho);

            if (!trabalho) {
                return ResponseHelper.notFound(res, MESSAGES.ERROR.TRABALHO_NOT_FOUND);
            }

            return ResponseHelper.success(res, trabalho, MESSAGES.SUCCESS.TRABALHO_UPDATED);
        } catch (error) {
            console.error(error);
            return ResponseHelper.error(res, 'Erro ao atualizar o trabalho.');
        }
    }

    };

module.exports = AdminController;  
