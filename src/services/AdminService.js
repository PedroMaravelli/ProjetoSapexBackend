const { Op } = require('sequelize');
const { Trabalho, Aluno, Professor, Localizacao, GuiaSapex, AlunoHasTrabalho, Admin } = require('../database/models');
const { EmailHelper, formatXlsxToJsonHelper } = require('../utils');
const EmailTemplates = require('../templates/emailTemplates');
const fs = require('fs').promises;


class AdminService {
  static async criarTrabalho(dadosTrabalho) {
    const { titulo, tipo, n_poster, data, horario, localizacao, professor, alunos, turma } = dadosTrabalho;

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
      turma: turma || null,
      n_poster,
      data,
      horario,
      professor_id: professorExistente.id,
      localizacao_id: novaLocalizacao.id
    });
    const templateEmailProfessor = EmailTemplates.novoTrabalhoProfessor(professorExistente.nome, novoTrabalho.titulo, novoTrabalho.data, novoTrabalho.horario)

    await EmailHelper.sendEmail("Novo trabalho para avaliação Sapex!!!", professorExistente.email, templateEmailProfessor )

    for (const aluno of alunos) {
      let alunoExistente = await Aluno.findOne({ where: { email: aluno.email } });

      if (!alunoExistente) {
        alunoExistente = await Aluno.create({
          nome: aluno.nome,
          email: aluno.email,
          turma: turma || 'não informado',
        });
      }

      await AlunoHasTrabalho.create({
        alunoId: alunoExistente.id,
        trabalhoId: novoTrabalho.id
      });

      const subject = "Você tem um novo trabalho no Sapex"
      const template = EmailTemplates.novoTrabalhoAlunos(alunoExistente.nome, novoTrabalho.titulo, novoTrabalho.data, novoTrabalho.horario, professorExistente.nome)

      await EmailHelper.sendEmail(subject, alunoExistente.email, template)
    }

    return novoTrabalho;
  }

  static async listarTrabalhos() {
    const anoAtual = new Date().getFullYear();
    
    return await Trabalho.findAll({
      where: {
        data: {
          [Op.gte]: new Date(`${anoAtual}-01-01`),
          [Op.lt]: new Date(`${anoAtual + 1}-01-01`)
        }
      },
      include: [
        {
          model: Aluno,
          as: "alunos"
        }
      ]
    });
  }

  static async obterInfosTrabalho(id) {
    return await Trabalho.findByPk(id, {
      include: [
        { model: Aluno, as: "alunos", through: { attributes: [] } },
        { model: Professor, as: "Professor" },
        { model: Localizacao, as: 'Localizacao' },
      ],
    });
  }

  static async editarTrabalho(id, dadosTrabalho) {
    const { titulo, tipo, n_poster, data, horario, localizacao, professor, alunos } = dadosTrabalho;
    
    const trabalho = await Trabalho.findByPk(id);
    if (!trabalho) return null;

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

    trabalho.titulo = titulo;
    trabalho.tipo = tipo;
    trabalho.n_poster = n_poster;
    trabalho.data = data;
    trabalho.horario = horario;

    await trabalho.save();
    return trabalho;
  }

  static async deletarTrabalho(id) {
    const trabalho = await Trabalho.findByPk(id);
    if (!trabalho) return null;
    
    await trabalho.destroy();
    return trabalho;
  }

  static async criarInstrucao(dadosInstrucao) {
    const { titulo, descricao } = dadosInstrucao;
    
    return await GuiaSapex.create({
      titulo,
      descricao
    });
  }

  static async listarInstrucoes() {
    return await GuiaSapex.findAll();
  }

  static async deletarGuiaSapex(id) {
    const guia = await GuiaSapex.findByPk(id);
    if (!guia) return null;
    
    await guia.destroy();
    return guia;
  }

  static async criarLocalizacao(dadosLocalizacao) {
    const { predio, sala, ponto_referencia } = dadosLocalizacao;
    
    return await Localizacao.create({
      predio,
      sala,
      ponto_referencia
    });
  }

  static async listarAdministradores(){
    return await Admin.findAll()
  }

  static async cadastroTrabalhosEmLote(caminhoArquivo){
    try {
      const trabalhosJsonFormat = formatXlsxToJsonHelper.format(caminhoArquivo); 
      
      for (const trabalho of trabalhosJsonFormat) {
        const dadosTrabalho = {
          titulo: trabalho.titulo,
          tipo: trabalho.tipo,
          n_poster: trabalho.n_poster,
          data: trabalho.data,
          horario: trabalho.horario,
          turma: trabalho.turma,
          localizacao: trabalho.localizacao,
          professor: trabalho.professor,
          alunos: trabalho.alunos
        };
        await AdminService.criarTrabalho(dadosTrabalho);
      }
      
      await fs.unlink(caminhoArquivo);
      return true;
      
    } catch (error) {
      console.error('Erro no cadastro em lote:', error);
      return false;
    }
  }
}

module.exports = AdminService;