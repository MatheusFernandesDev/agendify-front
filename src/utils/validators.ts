/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida CEP
 */
export function isValidCEP(cep: string): boolean {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
}

/**
 * Valida senha (mínimo 6 caracteres)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Valida horário (HH:MM)
 */
export function isValidTime(time: string): boolean {
  const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
}

/**
 * Valida data (não pode ser passada)
 */
export function isValidFutureDate(date: string): boolean {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

/**
 * Valida se é dia útil (segunda a sexta)
 */
export function isWeekday(date: string): boolean {
  const d = new Date(date);
  const day = d.getDay();
  return day >= 1 && day <= 5; // 1 = segunda, 5 = sexta
}