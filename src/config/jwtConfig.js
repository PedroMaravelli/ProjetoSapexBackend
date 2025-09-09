const jwt = require('jsonwebtoken');

class JwtService {
    static generateToken(payload) {
        if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
        }

        return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '42h',
        issuer: 'fsa-auth-system',
        });
    }

    static verifyToken(token) {
        try {
        return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
        throw new Error('Token inválido ou expirado');
        }
    }
}

module.exports = JwtService