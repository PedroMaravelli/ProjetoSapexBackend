const ResponseHelper = require('../../utils/ResponseHelper');
const { MESSAGES } = require('../../constants');

const atribuirNotaProfessorMiddleware = (schemas) => (req, res, next) => {
    try {
        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) {
                const errors = result.error.errors?.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                })) || [{ message: MESSAGES.ERROR.VALIDATION_ERROR }];
                
                return ResponseHelper.badRequest(res, MESSAGES.ERROR.VALIDATION_ERROR, errors);
            }
            req.validatedBody = result.data;
        }

        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                const errors = result.error.errors?.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                })) || [{ message: MESSAGES.ERROR.VALIDATION_ERROR }];
                
                return ResponseHelper.badRequest(res, MESSAGES.ERROR.VALIDATION_ERROR, errors);
            }
            req.validatedParams = result.data;
        }

        next();
    } catch (err) {
        return ResponseHelper.error(res, "Erro na validação");
    }
};

module.exports = atribuirNotaProfessorMiddleware;
