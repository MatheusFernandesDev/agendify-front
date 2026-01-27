// src/utils/formatters.ts

/**
 * Formata data no padrão brasileiro (DD/MM/YYYY)
 */
export function formatDate(date: string | Date): string {
  if (!date) return '-';

  if (typeof date === 'string') {
    // Divide a string "2026-01-28" e cria a data usando números (ano, mes-1, dia)
    // Isso força o JS a usar o fuso horário local
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
  }

  return new Date(date).toLocaleDateString('pt-BR');
}


/**
 * Formata data e hora (DD/MM/YYYY às HH:MM)
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d
    .toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', ' às');
}

/**
 * Formata horário (HH:MM)
 */
export function formatTime(time: string): string {
  return time;
}

/**
 * Formata CEP (00000-000)
 */
export function formatCEP(cep: string): string {
  return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

/**
 * Remove formatação do CEP
 */
export function unformatCEP(cep: string): string {
  return cep.replace(/\D/g, '');
}

/**
 * Formata nome completo
 */
export function formatFullName(name: string, surname: string): string {
  return `${name} ${surname}`;
}

/**
 * Capitaliza primeira letra
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Trunca texto
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}