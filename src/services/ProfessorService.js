const { Professor, Trabalho, AlunoHasTrabalho, Localizacao, Aluno } = require("../database/models");
const jwt = require('jsonwebtoken');

class ProfessorService {
  static async obterTrabalhosPorProfessor(emailProfessor) {
    const professor = await Professor.findOne({ where: { email: emailProfessor } });

    if (!professor) {
      return null;
    }

    const trabalhos = await Trabalho.findAll({
      where: { professor_id: professor.id }, 
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

    return trabalhos.map(trabalho => {
      const trabalhoObj = trabalho.toJSON();
      trabalhoObj.alunos = trabalhoObj.alunos.filter(aluno => aluno.aluno_has_trabalho.nota === null);
      return trabalhoObj;
    }).filter(trabalho => trabalho.alunos.length > 0);
  }

  static async obterProfessor(email) {
    return await Professor.findOne({ where: { email } });
  }

  static async atribuirNota(alunoId, trabalhoId, nota, justificativaNota) {
    const [updated] = await AlunoHasTrabalho.update(
      { nota, justificativa_nota: justificativaNota },
      { where: { aluno_id: alunoId, trabalho_id: trabalhoId } }
    );

    return updated > 0;
  }

  static async obterTrabalhosAvaliados(emailProfessor) {
    const professor = await Professor.findOne({ where: { email: emailProfessor } });

    if (!professor) {
      return null;
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

    return trabalhos.map(trabalho => {
      const trabalhoObj = trabalho.toJSON();
      trabalhoObj.alunos = trabalhoObj.alunos.filter(aluno => aluno.aluno_has_trabalho.nota !== null);
      return trabalhoObj;
    }).filter(trabalho => trabalho.alunos.length > 0);
  }

  static async obterNotaAluno(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email_aluno, trabalho_id } = decoded;

    if (!email_aluno || !trabalho_id) {
      throw new Error('Email do aluno e ID do trabalho são obrigatórios.');
    }
    
    const aluno = await Aluno.findOne({ 
      where: { 
        email: email_aluno 
      }
    });

    if (!aluno) {
      return null;
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
      return null;
    }

    return {
      nota: relacao.nota,
      justificativa_nota: relacao.justificativa_nota,
      trabalho: relacao.trabalho,
      aluno: relacao.aluno
    };
  }

  static async obterLocalizacaoTrabalho(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { trabalho_id } = decoded;

    const trabalho = await Trabalho.findOne({
      where: { id: trabalho_id },
      include: {
        model: Localizacao,
        as: "Localizacao", 
        required: true 
      }
    });

    if (!trabalho) {
      return null;
    }

    return trabalho.Localizacao;
  }
}

module.exports = ProfessorService;