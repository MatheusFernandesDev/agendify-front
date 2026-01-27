/**
 * Gera opções de horário
 */
export function generateTimeOptions(
  start: string = '08:00',
  end: string = '18:00',
  interval: number = 30
): string[] {
  const times: string[] = [];
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);

  let hour = startHour;
  let minute = startMin;

  while (hour < endHour || (hour === endHour && minute < endMin)) {
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    times.push(timeStr);

    minute += interval;
    if (minute >= 60) {
      hour += Math.floor(minute / 60);
      minute = minute % 60;
    }
  }

  return times;
}

/**
 * Busca CEP na API ViaCEP
 */
export async function fetchAddressByCEP(cep: string) {
  try {
    const cleanCEP = cep.replace(/\D/g, '');
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();

    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      address: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  } catch (error) {
    throw new Error('Erro ao buscar CEP');
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Formata erro da API
 */
export function getErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Ocorreu um erro inesperado';
}