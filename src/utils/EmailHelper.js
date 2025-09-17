const { transporter } = require("../config/emailConfig")

/**
 * Helper para envio de email
 */
    class EmailHelper {
        
        /**
         * 
         * @param {String} subject 
         * @param {String} email 
         * @param {String} link 
         * @returns 
         */
        static async sendEmail(subject, email, link){
            try {
                if(!email){
                return null
                }
                
                const message = {
                    from: "Sapex",
                    to: email,
                    subject: subject,
                    html: `
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
                            `
                }
                const sendingEmail = await transporter.sendMail(message)
                
                return sendingEmail

            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        }
    }

module.exports = EmailHelper