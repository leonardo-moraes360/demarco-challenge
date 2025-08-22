<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DashboardCard from '@/common/components/DashboardCard.vue';
import { dashboardStore } from '@/modules/home/stores/dashboard';
import { authStore } from '@/modules/auth/stores/auth';
import { storeToRefs } from 'pinia';

const router = useRouter();
const auth = authStore();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const dashboard = dashboardStore();
const { metrics, isLoading: loading, error } = storeToRefs(dashboard);

const loadMetrics = async () => {
  if (!auth.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  await dashboard.loadMetrics();
};

const getTokenStatus = () => {
  return localStorage.getItem('accessToken') ? 'Sim' : 'Não';
};

const testLogin = async () => {
  try {
    console.log('Testando login...');
    await auth.login({
      email: 'frontend@test.com',
      password: 'Password123!'
    });
    console.log('Login bem-sucedido, tentando carregar métricas...');
    await loadMetrics();
  } catch (err) {
    console.error('Erro ao testar login:', err);
    error.value = 'Erro ao testar login';
  }
};

onMounted(() => {
  loadMetrics();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
      <p class="text-slate-600">Bem-vindo ao sistema de gestão de atestados médicos</p>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-slate-500">Carregando métricas...</div>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="pi pi-exclamation-triangle text-red-400"></i>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Erro ao carregar métricas</h3>
          <div class="mt-2 text-sm text-red-700">{{ error }}</div>
          <div class="mt-2 text-xs text-red-600">
            <p><strong>Debug Info:</strong></p>
            <p>- URL da API: {{ API_BASE_URL }}</p>
            <p>- Usuário autenticado: {{ auth.isAuthenticated ? 'Sim' : 'Não' }}</p>
            <p>- Token presente: {{ getTokenStatus() }}</p>
          </div>
          <div class="mt-3 space-x-2">
            <button 
              @click="loadMetrics" 
              class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Tentar Novamente
            </button>
            <button 
              @click="testLogin" 
              class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Testar Login
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DashboardCard
        title="Total de Usuários"
        :value="metrics?.users?.totalUsers || 0"
        subtitle="Usuários cadastrados no sistema"
        icon="pi-users"
        icon-style="text-2xl text-blue-500"
      />
      <DashboardCard
        title="Sessões Ativas"
        :value="metrics?.sessions?.activeSessions || 0"
        subtitle="Sessões ativas no momento"
        icon="pi-clock"
        icon-style="text-2xl text-green-500"
      />
      <DashboardCard
        title="Atestados"
        :value="metrics?.medicalCertificates?.totalCertificates || 0"
        subtitle="Total de atestados médicos"
        icon="pi-file"
        icon-style="text-2xl text-orange-500"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-slate-900 mb-4">Ações Rápidas</h2>
        <div class="space-y-3">
          <router-link
            to="/users"
            class="flex items-center p-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <i class="pi pi-users text-blue-500 mr-3"></i>
            <span>Gerenciar Usuários</span>
            <i class="pi pi-chevron-right ml-auto text-slate-400"></i>
          </router-link>
          <router-link
            to="/medical-certificates"
            class="flex items-center p-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <i class="pi pi-file text-orange-500 mr-3"></i>
            <span>Gerenciar Atestados</span>
            <i class="pi pi-chevron-right ml-auto text-slate-400"></i>
          </router-link>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-slate-900 mb-4">Informações do Sistema</h2>
        <div class="space-y-3 text-sm text-slate-600">
          <div class="flex justify-between">
            <span>Versão:</span>
            <span class="font-medium">1.0.0</span>
          </div>
          <div class="flex justify-between">
            <span>Última atualização:</span>
            <span class="font-medium">{{ new Date().toLocaleDateString('pt-BR') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
