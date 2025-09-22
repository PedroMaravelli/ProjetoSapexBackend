const XLSX = require('xlsx');
const { cadastroTrabalhosSchema } = require('../validators/adminValidators');

/**
 * Formata arquivo Xlsx para json, para cadastro de trabalhos em lote
 * @param {*} caminhoArquivo 
 * @returns 
 */
    class formatXlsxToJsonHelper {

        /**
         * Formata a data do arquivo excel para o formato ISO 8601
         * @param {*} value
         * @returns
         */
        static parseDateExcel(value){
            if (!value) return null;
            if (value instanceof Date) return value.toISOString().slice(0,10);

            return value;
        }

        static format(caminhoArquivo) {
            try {
                const workbook = XLSX.readFile(caminhoArquivo);
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: null });

                const trabalhosMapped = rawRows.map((row, rowIndex) => {
                    const alunos = [];
                    let i = 1;
                    while (row[`Aluno Nome ${i}`] || row[`Aluno Email ${i}`]) {
                        const nome = row[`Aluno Nome ${i}`] ?? null;
                        const email = row[`Aluno Email ${i}`] ?? null;
                        if (nome || email) alunos.push({ nome, email });
                        i++;
                        
                        if (i > 10) break;
                    }

                    return {
                        titulo: row['Título'] || row['Titulo'] || row['titulo'],
                        tipo: row['Tipo'] || row['tipo'],
                        data: formatXlsxToJsonHelper.parseDateExcel(row['Data'] || row['data']),
                        turma: row['Turma'] || row['turma'] || null,
                        horario: row['Horário'] || row['Horario'] || row['horario'] || null,
                        n_poster: row['Nº Pôster'] || row['N Poster'] || row['n_poster'] || 0,
                        localizacao: {
                        predio: row['Prédio'] || row['Predio'] || null,
                        sala: row['Sala'] || null,
                        ponto_referencia: row['Ponto de Referência'] || row['Ponto de Referencia'] || null
                        },
                        professor: {
                        nome: row['Professor Nome'] || row['Professor'] || null,
                        email: row['Professor Email'] || row['ProfessorEmail'] || null
                        },
                        alunos
                    };
                    });

                    for (const trabalho of trabalhosMapped) {
                        cadastroTrabalhosSchema.parse(trabalho);
                    }
                    
                    return trabalhosMapped;
                    

            } catch (error) {
                throw new Error('Erro ao formatar arquivo XLSX para JSON: ' + error.message);
            }
    }
}

module.exports = formatXlsxToJsonHelper;

