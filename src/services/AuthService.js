const { Admin, Aluno } = require("../database/models");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { EmailHelper } = require("../utils");
const TokenService = require("./TokenService");

class AuthService {
  static async loginAdmin(email, senha) {
    const admin = await Admin.findOne({
      where: { email }
    });

    if (!admin) {
      return null;
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha);

    if (!senhaValida) {
      return { error: 'Senha incorreta.' };
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      nome: admin.nome, 
      role: 'admin' 
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, 
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d', 
      }
    );

    const { senha: _, ...adminSemSenha } = admin.toJSON();
    
    return {
      admin: adminSemSenha,
      token: token
    };
  }

  static async alterarSenhaAdmin(email, senha) {
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return null;
    }

    const hashSenha = await bcrypt.hash(senha, 10);
    await Admin.update({ senha: hashSenha }, { where: { email } });

    return admin;
  }

  static async esqueciSenhaAdmin(email){

    const admin = await Aluno.findOne({ where: { email } });

    if(!admin){
      return null
    }

    const subject = "Esqueci minha senha"
    
    const token = TokenService.gerarTokenEsqueciMinhaSenha(email)
    
    const link = `${process.env.FRONTEND_URL}/reset-password/${token}`

    const sendEmail = await EmailHelper.sendEmail(subject, email, link)


    if(!sendEmail){
      return null
    }
    return sendEmail

  }
}

module.exports = AuthService;