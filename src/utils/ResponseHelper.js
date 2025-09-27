const { HTTP_STATUS } = require('../constants');

class ResponseHelper {
  static success(res, data = null, message = 'Operação realizada com sucesso') {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data
    });
  }

  static created(res, data = null, message = 'Recurso criado com sucesso') {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'Erro interno do servidor', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }

  static notFound(res, message = 'Recurso não encontrado') {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message
    });
  }

  static badRequest(res, message = 'Dados inválidos', errors = null) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message,
      errors
    });
  }
  static unauthorized(res, message = 'Não autorizado', errors = null) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message,
      errors
    });
  }
}

module.exports = ResponseHelper;