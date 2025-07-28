const { z } = require("zod");

const authSchema = z.object({
    email: z.string().email().includes("@"),
    senha: z.string().min(6)

})

module.exports = authSchema;