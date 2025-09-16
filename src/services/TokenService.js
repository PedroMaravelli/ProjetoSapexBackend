const jwt = require('jsonwebtoken');

class TokenService {
  static gerarTokenAluno(alunoEmail, trabalhoId) {
    return jwt.sign({ aluno_email: alunoEmail, trabalho_id: trabalhoId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  static gerarTokenViewLocal(trabalhoId) {
    return jwt.sign({ trabalho_id: trabalhoId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  static gerarTokenAvaliacao(alunoId, trabalhoId) {
    return jwt.sign({ aluno_id: alunoId, trabalho_id: trabalhoId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  static gerarTokenNota(emailAluno, trabalhoId) {
    return jwt.sign({ email_aluno: emailAluno, trabalho_id: trabalhoId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  static gerarTokenLocal(trabalhoId) {
    return jwt.sign({ trabalho_id: trabalhoId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}

module.exports = TokenService;