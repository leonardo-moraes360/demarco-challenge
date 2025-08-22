import { defineStore } from "pinia";
import { ref } from "vue";
import { DashboardService } from "@/common/services/dashboard.service";
import type { DashboardMetrics } from "@/common/types/dashboard";

export const dashboardStore = defineStore("dashboard", () => {
  const metrics = ref<DashboardMetrics | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastUpdated = ref<Date | null>(null);

  const CACHE_TIMEOUT = 5 * 60 * 1000;
  async function loadMetrics(forceRefresh = false) {
    try {
      if (!forceRefresh && metrics.value && lastUpdated.value) {
        const timeSinceUpdate = Date.now() - lastUpdated.value.getTime();
        if (timeSinceUpdate < CACHE_TIMEOUT) {
          console.log('Usando métricas do cache');
          return metrics.value;
        }
      }

      isLoading.value = true;
      error.value = null;
      
      console.log('Carregando métricas do dashboard...');
      const response = await DashboardService.getMetrics();
      
      metrics.value = response;
      lastUpdated.value = new Date();
      
      console.log('Métricas carregadas:', response);
      return response;
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar métricas do dashboard';
      console.error('Erro ao carregar métricas:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function clearMetrics() {
    metrics.value = null;
    lastUpdated.value = null;
    error.value = null;
  }

  function clearError() {
    error.value = null;
  }

  function isCacheValid(): boolean {
    if (!metrics.value || !lastUpdated.value) return false;
    const timeSinceUpdate = Date.now() - lastUpdated.value.getTime();
    return timeSinceUpdate < CACHE_TIMEOUT;
  }

  function getCacheTimeRemaining(): number {
    if (!lastUpdated.value) return 0;
    const timeSinceUpdate = Date.now() - lastUpdated.value.getTime();
    const timeRemaining = CACHE_TIMEOUT - timeSinceUpdate;
    return Math.max(0, Math.ceil(timeRemaining / (60 * 1000)));
  }

  return {
    metrics,
    isLoading,
    error,
    lastUpdated,
    loadMetrics,
    clearMetrics,
    clearError,
    isCacheValid,
    getCacheTimeRemaining
  };
});
