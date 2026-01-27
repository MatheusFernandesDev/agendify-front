export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  room: string;
  status: 'analise' | 'agendado' | 'cancelado';
  user_id: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
}

export interface CreateAppointmentData {
  date: string;
  time: string;
  room: string;
}

export interface UpdateAppointmentData {
  date?: string;
  time?: string;
  room?: string;
  status?: 'analise' | 'agendado' | 'cancelado';
}

export interface AppointmentFilters {
  status?: 'analise' | 'agendado' | 'cancelado';
  room?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
  date:  string;
}

export interface AppointmentStats {
  total: number;
  byStatus: {
    analise: number;
    agendado: number;
    cancelado: number;
  };
  byRoom: Array<{
    room: string;
    count: number;
  }>;
  upcomingAppointments: number;
}