const ResponseHelper = require('../utils/ResponseHelper');
const { MESSAGES } = require('../constants');

const validationMiddleware = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
        const errors = result.error.errors?.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
        })) || [{ message: MESSAGES.ERROR.VALIDATION_ERROR }];
        
        return ResponseHelper.badRequest(res, MESSAGES.ERROR.VALIDATION_ERROR, errors);
    }

    req.validatedBody = result.data;
    next();
};

module.exports = validationMiddleware;