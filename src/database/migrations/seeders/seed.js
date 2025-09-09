const { Aluno, Localizacao, Professor, Trabalho, Admin, GuiaSapex, AdminHasTrabalho, AdminHasGuiaSapex } = require("../../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Inserir dados para Alunos
            const alunos = await Aluno.bulkCreate([
                { nome: 'Aluno 1', email: 'aluno1@mail.com', ra: 123456, senha: 'senha123', turma: 'Turma A', nota: 9.5 },
                { nome: 'Aluno 2', email: 'aluno2@mail.com', ra: 654321, senha: 'senha321', turma: 'Turma B', nota: 8.5 }
            ]);

            // Inserir dados para Localizações
            const localizacoes = await Localizacao.bulkCreate([
                { predio: 'Predio 1', sala: 'Sala 101', ponto_referencia: 'Perto da biblioteca' },
                { predio: 'Predio 2', sala: 'Sala 102', ponto_referencia: 'Perto do refeitório' }
            ]);

            // Inserir dados para Professores
            const professores = await Professor.bulkCreate([
                { nome: 'Professor 1', email: 'prof1@mail.com', re: 1111, senha: 'senha123' },
                { nome: 'Professor 2', email: 'prof2@mail.com', re: 2222, senha: 'senha321' }
            ]);

            // Inserir dados para Admins
            const admins = await Admin.bulkCreate([
                { nome: 'Admin 1', email: 'admin1@mail.com', senha: 'admin123', matricula: 'ADM123' },
                { nome: 'Admin 2', email: 'admin2@mail.com', senha: 'admin321', matricula: 'ADM321' }
            ]);

            // Inserir dados para Trabalhos
            const trabalhos = await Trabalho.bulkCreate([
                {
                    titulo: 'Trabalho de TI',
                    tipo: 'Pesquisa',
                    n_poster: 1,
                    data: new Date(),
                    horario: '14:00',
                    aluno_id: alunos[0].id,
                    professor_id: professores[0].id,
                    localizacao_id: localizacoes[0].id
                },
                {
                    titulo: 'Trabalho de Matemática',
                    tipo: 'Exercício',
                    n_poster: 2,
                    data: new Date(),
                    horario: '16:00',
                    aluno_id: alunos[1].id,
                    professor_id: professores[1].id,
                    localizacao_id: localizacoes[1].id
                }
            ]);

            // Inserir dados para Guias
            const guias = await GuiaSapex.bulkCreate([
                { titulo: 'Guia 1', descricao: 'Descrição do Guia 1' },
                { titulo: 'Guia 2', descricao: 'Descrição do Guia 2' }
            ]);

            // Criar relacionamentos entre Admins e Trabalhos
            await AdminHasTrabalho.bulkCreate([
                { admin_id: admins[0].id, trabalho_id: trabalhos[0].id },
                { admin_id: admins[1].id, trabalho_id: trabalhos[1].id }
            ]);

            // Criar relacionamentos entre Admins e Guias
            await AdminHasGuiaSapex.bulkCreate([
                { admin_id: admins[0].id, guia_sapex_id: guias[0].id },
                { admin_id: admins[1].id, guia_sapex_id: guias[1].id }
            ]);

            console.log("Dados de teste inseridos com sucesso.");
        } catch (error) {
            console.error('Erro ao inserir dados de teste:', error);
        }
    },

    down: async (queryInterface, Sequelize) => {
        // O método 'down' pode ser deixado vazio, já que você ainda não criou as tabelas.
    }
};
