const { transporter } = require("../config/emailConfig")

/**
 * Helper para envio de email
 */
    class EmailHelper {
        
        /**
         * 
         * @param {String} subject 
         * @param {String} email 
         * @param {String} template
         * @returns 
         */
        static async sendEmail(subject, email,template){
            try {
                if(!email){
                return null
                }
                
                const message = {
                    from: "Sapex",
                    to: email,
                    subject: subject,
                    html: template
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