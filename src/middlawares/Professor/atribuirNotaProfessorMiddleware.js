const atribuirNotaProfessorMiddleware = (schemas) => (req, res, next) => {
    try {
        if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.format() });
        }
        req.validatedBody = result.data;
        }

        if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.format() });
        }
        req.validatedParams = result.data;
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: "Erro na validação" });
    }
};

module.exports = atribuirNotaProfessorMiddleware;
