import { api } from './api';
import type { DashboardMetrics } from '@/common/types/dashboard';

export class DashboardService {
  static async getMetrics(): Promise<DashboardMetrics> {
    return api.get('dashboard/metrics').json<DashboardMetrics>();
  }
}
