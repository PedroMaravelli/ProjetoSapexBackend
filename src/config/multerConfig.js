const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const extensaoArquivo = file.originalname.split('.')[1];

        const novoNomeArquivo = require('crypto')
            .randomBytes(64)
            .toString('hex');

        cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
    }

})



module.exports = {
    storage: storage
}