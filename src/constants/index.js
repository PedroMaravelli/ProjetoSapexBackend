const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const USER_ROLES = {
  ADMIN: 'administrador',
  PROFESSOR: 'professor',
  ALUNO: 'aluno'
};

const EMAIL_DOMAINS = {
  ADMIN: 'admin@fsa.br',
  STUDENT: '@graduacao.fsa.br',
  PROFESSOR: '@fsa.br',
  GMAIL: '@gmail.com'
};

const MESSAGES = {
  SUCCESS: {
    TRABALHO_CREATED: 'Trabalho cadastrado com sucesso.',
    TRABALHO_UPDATED: 'Trabalho atualizado com sucesso.',
    TRABALHO_DELETED: 'Trabalho deletado com sucesso.',
    GUIA_CREATED: 'Guia criada com sucesso.',
    GUIA_DELETED: 'Guia deletada com sucesso.',
    LOCALIZACAO_CREATED: 'Localização criada com sucesso.'
  },
  ERROR: {
    INTERNAL_ERROR: 'Erro interno do servidor.',
    TRABALHO_NOT_FOUND: 'Trabalho não encontrado.',
    GUIA_NOT_FOUND: 'Guia não encontrada.',
    REQUIRED_FIELDS: 'Todos os campos são obrigatórios.',
    INVALID_EMAIL: 'Email não pertence ao domínio institucional autorizado.',
    VALIDATION_ERROR: 'Erro de validação.'
  }
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  EMAIL_DOMAINS,
  MESSAGES
};