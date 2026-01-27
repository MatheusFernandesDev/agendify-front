export const APPOINTMENT_STATUS = {
  ANALISE: 'analise',
  AGENDADO: 'agendado',
  CANCELADO: 'cancelado',
} as const;

export const APPOINTMENT_STATUS_LABELS = {
  analise: 'Em análise',
  agendado: 'Agendado',
  cancelado: 'Cancelado',
} as const;

export const APPOINTMENT_STATUS_COLORS = {
  analise: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  agendado: 'bg-green-100 text-green-800 border-green-200',
  cancelado: 'bg-red-100 text-red-800 border-red-200',
} as const;

export const USER_ROLES = {
  CLIENTE: 'cliente',
  ADMIN: 'admin',
} as const;

export const USER_ROLE_LABELS = {
  cliente: 'Cliente',
  admin: 'Administrador',
} as const;

export const ROOMS = [
  'Sala 012',
  'Sala 015',
  'Sala 020',
  'Sala 025',
] as const;

export const BUSINESS_HOURS = {
  START: '08:00',
  END: '18:00',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [10, 20, 50, 100],
} as const;

export const DATE_FORMATS = {
  BR: 'DD/MM/YYYY',
  ISO: 'YYYY-MM-DD',
  TIME: 'HH:mm',
} as const;

export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login realizado com sucesso',
    LOGOUT: 'Logout realizado com sucesso',
    REGISTER: 'Cadastro realizado com sucesso',
    APPOINTMENT_CREATED: 'Agendamento criado com sucesso',
    APPOINTMENT_UPDATED: 'Agendamento atualizado com sucesso',
    APPOINTMENT_CANCELLED: 'Agendamento cancelado com sucesso',
    APPOINTMENT_CONFIRMED: 'Agendamento confirmado com sucesso',
    PROFILE_UPDATED: 'Perfil atualizado com sucesso',
    PASSWORD_UPDATED: 'Senha atualizada com sucesso',
  },
  ERROR: {
    GENERIC: 'Ocorreu um erro. Tente novamente',
    INVALID_CREDENTIALS: 'Email ou senha inválidos',
    REQUIRED_FIELDS: 'Preencha todos os campos obrigatórios',
    INVALID_EMAIL: 'Email inválido',
    INVALID_PASSWORD: 'Senha deve ter no mínimo 6 caracteres',
    INVALID_CEP: 'CEP inválido',
    INVALID_TIME: 'Horário inválido (use HH:MM)',
    INVALID_DATE: 'Data inválida',
    PAST_DATE: 'A data deve ser futura',
    NOT_WEEKDAY: 'Agendamentos apenas em dias úteis',
    OUTSIDE_BUSINESS_HOURS: 'Horário deve ser entre 08:00 e 18:00',
  },
} as const;