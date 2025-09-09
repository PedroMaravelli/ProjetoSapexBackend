const jwt = require('jsonwebtoken');

const gerarTokenController = {
    GerarTokenAvaliacao: async (req, res) => {
        const { aluno_id, trabalho_id } = req.params;
        if (!aluno_id || !trabalho_id) {
            return res.status(400).json({ message: 'Parâmetros insuficientes.' });
        }
        const token = jwt.sign({ aluno_id, trabalho_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    },

    GerarTokenNota: async (req, res) => {
        const { email_aluno, trabalho_id } = req.params;

        if (!email_aluno || !trabalho_id) {
            return res.status(400).json({ message: 'Parâmetros insuficientes.' });
        }
        const token = jwt.sign({ email_aluno, trabalho_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    },

    GerarTokenLocal: async (req, res) => {
        const { trabalho_id } = req.params;
        if (!trabalho_id) {
            return res.status(400).json({ message: 'Parâmetros insuficientes.' });
        }
        const token = jwt.sign({ trabalho_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }
}

module.exports = gerarTokenController;