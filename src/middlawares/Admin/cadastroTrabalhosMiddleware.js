const cadastroTrabalhosMiddleware = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
        errors: result.error.errors?.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
        })) || [{ message: 'Erro de validação' }],
        });
    }

    req.validatedBody = result.data;
    next();
};

module.exports = cadastroTrabalhosMiddleware;