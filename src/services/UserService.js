const { USER_ROLES, EMAIL_DOMAINS, MESSAGES } = require('../constants');

class UserService {
    static determineUserRole(email) {
        if (!email) {
        throw new Error('Email é obrigatório');
        }

        const emailLower = email.toLowerCase();

        if (emailLower === EMAIL_DOMAINS.ADMIN) {
        return USER_ROLES.ADMIN;
        }

        if (emailLower.endsWith(EMAIL_DOMAINS.STUDENT)) {
        return USER_ROLES.ALUNO;
        }

        if (emailLower.endsWith(EMAIL_DOMAINS.PROFESSOR) || emailLower.endsWith(EMAIL_DOMAINS.GMAIL)) {
            return USER_ROLES.PROFESSOR;
        }

        throw new Error(MESSAGES.ERROR.INVALID_EMAIL);
    }

    static validateInstitutionalEmail(email) {
        const allowedDomains = [EMAIL_DOMAINS.STUDENT, EMAIL_DOMAINS.PROFESSOR, EMAIL_DOMAINS.GMAIL];

        if (email.toLowerCase() === EMAIL_DOMAINS.ADMIN) {
        return true;
        }

        return allowedDomains.some(domain => 
        email.toLowerCase().endsWith(domain)
        );
    }

    static formatUserResponse(userProfile) {
        const role = this.determineUserRole(userProfile.email);
        
        return {
        name: userProfile.name,
        email: userProfile.email,
        role: role,
        avatar: userProfile.avatar,
        googleId: userProfile.googleId
        };
    }
    }

module.exports = UserService;