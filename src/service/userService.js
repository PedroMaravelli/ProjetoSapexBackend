class UserService {
    static determineUserRole(email) {
        if (!email) {
        throw new Error('Email é obrigatório');
        }

        const emailLower = email.toLowerCase();


        if (emailLower === 'admin@fsa.br') {
        return 'administrador';
        }


        if (emailLower.endsWith('@graduacao.fsa.br')) {
        return 'aluno';
        }

        if (emailLower.endsWith('@gmail.com')) {
        return 'prof';
        }

        // Email não autorizado
        throw new Error('Email não pertence ao domínio institucional da Fundação Santo André autorizado');
    }

    static validateInstitutionalEmail(email) {
        const allowedDomains = ['@graduacao.fsa.br', '@fsa.br', "@gmail.com"];
        const specificAdminEmail = 'admin@fsa.br';

        if (email.toLowerCase() === specificAdminEmail) {
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