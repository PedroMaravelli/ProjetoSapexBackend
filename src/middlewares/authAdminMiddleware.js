const JwtService = require('../config/jwtConfig');
const ResponseHelper = require('../utils/ResponseHelper');

const authAdminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return ResponseHelper.unauthorized(res, 'Token de acesso requerido');
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return ResponseHelper.unauthorized(res, 'Token de acesso inválido');
    }

    try {
        const decoded = JwtService.verifyToken(token);
        req.admin = decoded;
        next();
    } catch (error) {
        return ResponseHelper.unauthorized(res, 'Token inválido ou expirado');
    }
};

module.exports = authAdminMiddleware;