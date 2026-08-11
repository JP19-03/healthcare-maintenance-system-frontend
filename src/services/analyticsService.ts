import api from './api';
import type { DashboardSummary } from '../types';

export const analyticsService = {
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>('/analytics/dashboard-summary');
    return response.data;
  },
};
