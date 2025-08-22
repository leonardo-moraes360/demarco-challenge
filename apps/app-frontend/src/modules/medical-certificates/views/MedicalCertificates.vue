<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { medicalCertificatesStore } from "@/modules/medical-certificates/stores/medical-certificates";
import { usersStore } from "@/modules/users/stores/users";
import { authStore } from "@/modules/auth/stores/auth";
import { storeToRefs } from "pinia";
import type { MedicalCertificate, CreateMedicalCertificateRequest, UpdateMedicalCertificateRequest } from "@/common/types/medical-certificate";
import MedicalCertificateModal from "@/common/components/MedicalCertificateModal.vue";
import Input from "@/common/components/Input.vue";
import Button from "@/common/components/Button.vue";
import VoltSelect from '@/volt/Select.vue';

const router = useRouter();
const auth = authStore();

const certificatesStore = medicalCertificatesStore();
const userStore = usersStore();

const {
  certificates,
  totalCertificates,
  currentPage,
  pageSize,
  isLoading,
  error,
  searchNumber,
  searchIcd,
  searchUserName,
  filterStatus,
  totalPages,
  hasNextPage,
  hasPrevPage
} = storeToRefs(certificatesStore);

const { activeUsers: users } = storeToRefs(userStore);

const isModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const selectedCertificate = ref<MedicalCertificate | null>(null);

async function loadCertificates() {
  await certificatesStore.loadCertificates();
}

async function loadUsers() {
  await userStore.loadActiveUsers();
}

function handleSearch() {
  certificatesStore.setPage(1);
  loadCertificates();
}

function handlePageChange(page: number) {
  certificatesStore.setPage(page);
  loadCertificates();
}

function openCreateModal() {
  modalMode.value = 'create';
  selectedCertificate.value = null;
  isModalOpen.value = true;
}

function openEditModal(certificate: MedicalCertificate) {
  modalMode.value = 'edit';
  selectedCertificate.value = certificate;
  isModalOpen.value = true;
}

async function handleSaveCertificate(data: CreateMedicalCertificateRequest | UpdateMedicalCertificateRequest) {
  try {
    if (modalMode.value === 'create') {
      const createData = data as CreateMedicalCertificateRequest;
      createData.userCreatedById = auth.user?.id || '';
      
      await certificatesStore.createCertificate(createData);
    } else if (selectedCertificate.value) {
      await certificatesStore.updateCertificate(selectedCertificate.value.id, data as UpdateMedicalCertificateRequest);
    }
    
    isModalOpen.value = false;
  } catch (err: any) {
    console.error('Erro ao salvar atestado:', err);
  }
}

async function handleDeleteCertificate(certificate: MedicalCertificate) {
  const userName = certificate.userBelongsTo?.fullName || 'usuário';
  if (!confirm(`Tem certeza que deseja excluir o atestado médico de "${userName}"?`)) {
    return;
  }
  
  try {
    await certificatesStore.deleteCertificate(certificate.id);
  } catch (err: any) {
    console.error('Erro ao excluir atestado:', err);
  }
}

const { formatDate, formatDateTime, getCertificateStatusColor, getCertificateStatusText } = certificatesStore;

const statusOptions = [
  { label: 'Todos', value: '' },
  { label: 'Ativo', value: 'active' },
  { label: 'Inativo', value: 'inactive' }
];

onMounted(() => {
  if (!auth.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  loadCertificates();
  loadUsers();
});
</script>

<template>
    <div class="max-w-7xl mx-auto">
        <div class="mb-8">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">
                        Atestados Médicos
                    </h1>
                    <p class="text-gray-600">
                        Gerencie os atestados médicos do sistema.
                    </p>
                </div>
                <Button @click="openCreateModal">
                    Novo Atestado
                </Button>
            </div>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="min-w-0">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Buscar por Número
                    </label>
                    <Input
                        v-model="searchNumber"
                        type="text"
                        placeholder="Digite o número"
                        @keyup.enter="handleSearch"
                    />
                </div>
                <div class="min-w-0">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Buscar por CID
                    </label>
                    <Input
                        v-model="searchIcd"
                        type="text"
                        placeholder="Ex: E10.1"
                        @keyup.enter="handleSearch"
                    />
                </div>
                <div class="min-w-0">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Buscar por Usuário
                    </label>
                    <Input
                        v-model="searchUserName"
                        type="text"
                        placeholder="Nome do usuário"
                        @keyup.enter="handleSearch"
                    />
                </div>
                <div class="min-w-0">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <VoltSelect
                        v-model="filterStatus"
                        :options="statusOptions"
                        placeholder="Selecione o status"
                        class="w-full"
                        @change="handleSearch"
                    />
                </div>
            </div>
            <div class="mt-6 flex justify-end">
                <Button @click="handleSearch">
                    Buscar
                </Button>
            </div>
        </div>
        
        <!-- Error -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {{ error }}
        </div>
        
        <!-- Certificates List -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">
                    Lista de Atestados Médicos ({{ totalCertificates }})
                </h2>
            </div>
            
            <!-- Loading -->
            <div v-if="isLoading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
            
            <div v-else-if="certificates.length === 0" class="px-6 py-12 text-center text-gray-500">
                Nenhum atestado médico encontrado.
            </div>
            
            <div v-else class="divide-y divide-gray-200">
                <div 
                    v-for="certificate in certificates" 
                    :key="certificate.id"
                    class="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <h3 class="text-lg font-medium text-gray-900">
                                    CID: {{ certificate.icd }}
                                </h3>
                                <span class="text-sm text-gray-500">
                                    ({{ certificate.icdVersion }})
                                </span>
                                <span 
                                    :class="[
                                        'px-2 py-1 text-xs font-medium rounded-full',
                                        getCertificateStatusColor(certificate)
                                    ]"
                                >
                                    {{ getCertificateStatusText(certificate) }}
                                </span>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <p><strong>Usuário:</strong> {{ certificate.userBelongsTo?.fullName || 'N/A' }}</p>
                                    <p><strong>Criado por:</strong> {{ certificate.userCreatedBy?.fullName || 'N/A' }}</p>
                                    <p v-if="certificate.number"><strong>Número:</strong> {{ certificate.number }}</p>
                                </div>
                                <div>
                                    <p><strong>Período:</strong> {{ formatDate(certificate.startsAt) }} até {{ formatDate(certificate.endsAt) }}</p>
                                    <p><strong>Arquivo:</strong> {{ certificate.fileName }}</p>
                                    <p><strong>Criado em:</strong> {{ formatDateTime(certificate.createdAt) }}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-x-2 ml-4">
                            <Button
                                severity="secondary"
                                size="small"
                                @click="openEditModal(certificate)"
                            >
                                Editar
                            </Button>
                            <Button
                                severity="danger"
                                size="small"
                                @click="handleDeleteCertificate(certificate)"
                            >
                                Excluir
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-700">
                        Mostrando {{ (currentPage - 1) * pageSize + 1 }} a {{ Math.min(currentPage * pageSize, totalCertificates) }} de {{ totalCertificates }} resultados
                    </div>
                    <div class="flex items-center space-x-2">
                        <Button
                            severity="secondary"
                            size="small"
                            :disabled="!hasPrevPage"
                            @click="handlePageChange(currentPage - 1)"
                        >
                            Anterior
                        </Button>
                        <span class="text-sm text-gray-700">
                            Página {{ currentPage }} de {{ totalPages }}
                        </span>
                        <Button
                            severity="secondary"
                            size="small"
                            :disabled="!hasNextPage"
                            @click="handlePageChange(currentPage + 1)"
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Certificate Modal -->
        <MedicalCertificateModal
            :is-open="isModalOpen"
            :medical-certificate="selectedCertificate"
            :users="users"
            :loading="isLoading"
            @close="isModalOpen = false"
            @submit="handleSaveCertificate"
        />
    </div>
</template>
