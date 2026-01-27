export interface Log {
  id: string;
  description: string;
  entity: string;
  createdAt: string;
  user: {
    name: string;
    surname: string;
    role: string;
  };
}

export interface LogFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  activityType?: string;
  module?: string;
}