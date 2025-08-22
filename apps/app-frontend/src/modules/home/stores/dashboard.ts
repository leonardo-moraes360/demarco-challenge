import { defineStore } from "pinia";
import { ref } from "vue";
import { DashboardService } from "@/common/services/dashboard.service";
import type { DashboardMetrics } from "@/common/types/dashboard";

export const dashboardStore = defineStore("dashboard", () => {
  // Estado
  const metrics = ref<DashboardMetrics | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastUpdated = ref<Date | null>(null);

  // Cache timeout (5 minutos)
  const CACHE_TIMEOUT = 5 * 60 * 1000;

  // Ações
  async function loadMetrics(forceRefresh = false) {
    try {
      // Verificar cache se não for refresh forçado
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

  // Verificar se o cache está válido
  function isCacheValid(): boolean {
    if (!metrics.value || !lastUpdated.value) return false;
    const timeSinceUpdate = Date.now() - lastUpdated.value.getTime();
    return timeSinceUpdate < CACHE_TIMEOUT;
  }

  // Tempo restante do cache em minutos
  function getCacheTimeRemaining(): number {
    if (!lastUpdated.value) return 0;
    const timeSinceUpdate = Date.now() - lastUpdated.value.getTime();
    const timeRemaining = CACHE_TIMEOUT - timeSinceUpdate;
    return Math.max(0, Math.ceil(timeRemaining / (60 * 1000)));
  }

  return {
    // Estado
    metrics,
    isLoading,
    error,
    lastUpdated,
    
    // Ações
    loadMetrics,
    clearMetrics,
    clearError,
    isCacheValid,
    getCacheTimeRemaining
  };
});
