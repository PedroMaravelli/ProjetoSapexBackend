class EmailTemplates {
  static formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  }
  static resetPasswordTemplate(link) {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <title>Recuperação de Senha</title>
          <style>
          body { margin:0; padding:0; font-family:Arial,sans-serif; background:#f4f4f4; }
          .container { max-width:600px; margin:30px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
          .header { background:#4a90e2; color:#fff; text-align:center; padding:20px; font-size:20px; font-weight:bold; }
          .content { padding:30px; color:#333; line-height:1.6; font-size:15px; }
          .button { display:inline-block; margin:20px 0; padding:12px 24px; background:#4a90e2; color:#fff !important; text-decoration:none; border-radius:6px; font-weight:bold; }
          .footer { text-align:center; padding:20px; font-size:12px; color:#777; background:#f9f9f9; }
          </style>
      </head>
      <body>
          <div class="container">
          <div class="header">Recuperação de Senha</div>
          <div class="content">
              <p>Olá,</p>
              <p>Recebemos uma solicitação para redefinir a sua senha.<br>
              Clique no botão abaixo para criar uma nova senha:</p>
              <p style="text-align:center;">
              <a href="${link}" class="button">Redefinir Senha</a>
              </p>
              <p>Se você não solicitou a redefinição, ignore este e-mail.<br>
              O link expira em <b>24 horas</b> por motivos de segurança.</p>
              <p>Atenciosamente,<br>Equipe Projeto Sapex</p>
          </div>
          <div class="footer">© 2025 Projeto Sapex. Todos os direitos reservados.</div>
          </div>
      </body>
      </html>
    `;
  }

  static novoTrabalhoProfessor(nomeProfessor, titulo, data, horario) {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <title>Novo Trabalho Para Avaliação</title>
          <style>
          body { margin:0; padding:0; font-family:Arial,sans-serif; background:#f4f4f4; }
          .container { max-width:600px; margin:30px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
          .header { background:#28a745; color:#fff; text-align:center; padding:20px; font-size:20px; font-weight:bold; }
          .content { padding:30px; color:#333; line-height:1.6; font-size:15px; }
          .info-box { background:#f8f9fa; padding:15px; border-radius:6px; margin:15px 0; }
          .footer { text-align:center; padding:20px; font-size:12px; color:#777; background:#f9f9f9; }
          </style>
      </head>
      <body>
          <div class="container">
          <div class="header">Novo Trabalho Para Avaliação</div>
          <div class="content">
              <p>Olá, <strong>${nomeProfessor}</strong>!</p>
              <p>Um novo trabalho foi agendado para sua avaliação:</p>
              <div class="info-box">
                  <p><strong>Título:</strong> ${titulo}</p>
                  <p><strong>Data:</strong> ${this.formatarData(data)}</p>
                  <p><strong>Horário:</strong> ${horario}</p>
              </div>
              <p>Atenciosamente,<br>Equipe Sapex</p>
          </div>
          <div class="footer">© 2025 Sapex. Todos os direitos reservados.</div>
          </div>
      </body>
      </html>
    `;
  }

  static novoTrabalhoAlunos(nomeAluno, titulo, data, horario, nomeProfessor) {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <title>Trabalho Agendado</title>
          <style>
          body { margin:0; padding:0; font-family:Arial,sans-serif; background:#f4f4f4; }
          .container { max-width:600px; margin:30px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
          .header { background:#007bff; color:#fff; text-align:center; padding:20px; font-size:20px; font-weight:bold; }
          .content { padding:30px; color:#333; line-height:1.6; font-size:15px; }
          .info-box { background:#f8f9fa; padding:15px; border-radius:6px; margin:15px 0; }
          .footer { text-align:center; padding:20px; font-size:12px; color:#777; background:#f9f9f9; }
          </style>
      </head>
      <body>
          <div class="container">
          <div class="header">Novo Trabalho</div>
          <div class="content">
              <p>Olá, <strong>${nomeAluno}</strong>!</p>
              <p>Você foi cadastrado para uma apresentação no Sapex:</p>
              <div class="info-box">
                  <p><strong>Título:</strong> ${titulo}</p>
                  <p><strong>Data:</strong> ${this.formatarData(data)}</p>
                  <p><strong>Horário:</strong> ${horario}</p>
                  <p><strong>Professor:</strong> ${nomeProfessor}</p>
              </div>
              <p>Atenciosamente,<br>Equipe Sapex</p>
          </div>
          <div class="footer">© 2025 Sapex. Todos os direitos reservados.</div>
          </div>
      </body>
      </html>
    `;
  }
}

module.exports = EmailTemplates;