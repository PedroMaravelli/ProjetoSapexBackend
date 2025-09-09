
const jwt = require('jsonwebtoken');

const gerarTokenController = {
     GerarToken: async (req,res) =>{
    
            const { aluno_email, trabalho_id } = req.params;
            if (!aluno_email || !trabalho_id) {
                return res.status(400).json({ message: 'Parâmetros insuficientes.' });
            }
            const token = jwt.sign({ aluno_email, trabalho_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token });
        },
    
        GerarTokenViewLocal: async (req,res) =>{
    
            const { trabalho_id } = req.params;
            if (!trabalho_id) {
                return res.status(400).json({ message: 'Parâmetros insuficientes.' });
            }
            const token = jwt.sign({trabalho_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token });
        },
}

module.exports = gerarTokenController;  