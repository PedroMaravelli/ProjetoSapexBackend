const { Op } = require("sequelize");
const { Aluno, Trabalho, AlunoHasTrabalho, Professor } = require("../database/models");
const jwt = require('jsonwebtoken');

class AlunoService {
  static async obterTodosTrabalhos() {
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

  static async obterMeusTrabalhos(alunoEmail) {
    const aluno = await Aluno.findOne({ where: { email: alunoEmail } });
    
    if (!aluno) {
      return null;
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
              as: "Professor"
            },
            {
              model: Aluno,
              as: "alunos"
            }
          ] 
        }
      ]
    });

    return trabalhos.map(item => item.trabalho);
  }

  static async obterNotaAluno(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { aluno_email, trabalho_id } = decoded;

    const aluno = await Aluno.findOne({ where: { email: aluno_email } });
    
    if (!aluno) {
      return null;
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
      return null;
    }

    return {
      nota: relacao.nota,
      justificativa_nota: relacao.justificativa_nota,
      trabalho: relacao.trabalho,
      aluno: relacao.aluno
    };
  }
}

module.exports = AlunoService;