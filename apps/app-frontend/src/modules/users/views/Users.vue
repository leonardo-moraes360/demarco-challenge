<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usersStore } from "@/modules/users/stores/users";
import { storeToRefs } from "pinia";
import type { CreateUserRequest, UpdateUserRequest } from "@/common/services/users.service";
import type { User } from "@/common/types/auth";
import UserModal from "@/common/components/UserModal.vue";
import Input from "@/common/components/Input.vue";
import Button from "@/common/components/Button.vue";
import Dropdown from 'primevue/dropdown';

// Store
const store = usersStore();
const {
  users,
  totalUsers,
  currentPage,
  pageSize,
  isLoading,
  error,
  searchName,
  searchCpf,
  filterStatus,
  totalPages,
  hasNextPage,
  hasPrevPage
} = storeToRefs(store);

// Modal state
const isModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const selectedUser = ref<User | null>(null);

async function loadUsers() {
  await store.loadUsers();
}

function handleSearch() {
  store.setPage(1);
  loadUsers();
}

function handlePageChange(page: number) {
  store.setPage(page);
  loadUsers();
}

function openCreateModal() {
  modalMode.value = 'create';
  selectedUser.value = null;
  isModalOpen.value = true;
}

function openEditModal(user: User) {
  modalMode.value = 'edit';
  selectedUser.value = user;
  isModalOpen.value = true;
}

async function handleSaveUser(data: CreateUserRequest | UpdateUserRequest) {
  try {
    if (modalMode.value === 'create') {
      await store.createUser(data as CreateUserRequest);
    } else if (selectedUser.value) {
      await store.updateUser(selectedUser.value.id, data as UpdateUserRequest);
    }
    
    isModalOpen.value = false;
  } catch (err: any) {
    console.error('Erro ao salvar usuário:', err);
  }
}

async function handleDeleteUser(user: User) {
  if (!confirm(`Tem certeza que deseja excluir o usuário "${user.fullName}"?`)) {
    return;
  }
  
  try {
    await store.deleteUser(user.id);
  } catch (err: any) {
    console.error('Erro ao excluir usuário:', err);
  }
}

const statusOptions = [
  { label: 'Todos', value: '' },
  { label: 'Ativo', value: 'active' },
  { label: 'Inativo', value: 'inactive' }
];

onMounted(() => {
  loadUsers();
});
</script>

<template>
    <div class="max-w-6xl mx-auto">
        <div class="mb-8">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">
                        Colaboradores
                    </h1>
                    <p class="text-gray-600">
                        Gerencie os colaboradores do sistema.
                    </p>
                </div>
                <Button @click="openCreateModal">
                    Novo Colaborador
                </Button>
            </div>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="min-w-0">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Buscar por Nome
                    </label>
                    <Input
                        v-model="searchName"
                        type="text"
                        placeholder="Digite o nome"
                        @keyup.enter="handleSearch"
                    />
                </div>
                <div class="min-w-0">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Buscar por CPF
                    </label>
                    <Input
                        v-model="searchCpf"
                        type="text"
                        placeholder="000.000.000-00"
                        @keyup.enter="handleSearch"
                    />
                </div>
                <div class="min-w-0">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <Dropdown
                        v-model="filterStatus"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
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
        
        <!-- Users List -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">
                    Lista de Colaboradores ({{ totalUsers }})
                </h2>
            </div>
            
            <!-- Loading -->
            <div v-if="isLoading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
            
            <div v-else-if="users.length === 0" class="px-6 py-12 text-center text-gray-500">
                Nenhum colaborador encontrado.
            </div>
            
            <div v-else class="divide-y divide-gray-200">
                <div 
                    v-for="user in users" 
                    :key="user.id"
                    class="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <h3 class="text-lg font-medium text-gray-900">{{ user.fullName }}</h3>
                            <p class="text-sm text-gray-600">{{ user.email }}</p>
                            <p class="text-xs text-gray-500">CPF: {{ user.cpf }}</p>
                            <p class="text-xs text-gray-500">Cargo: {{ user.position || 'Não informado' }}</p>
                        </div>
                        <div class="flex items-center gap-x-2">
                            <span 
                                :class="[
                                    'px-2 py-1 text-xs font-medium rounded-full',
                                    user.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                ]"
                            >
                                {{ user.status === 'active' ? 'Ativo' : 'Inativo' }}
                            </span>
                            <Button
                                severity="secondary"
                                size="small"
                                @click="openEditModal(user)"
                            >
                                Editar
                            </Button>
                            <Button
                                severity="danger"
                                size="small"
                                @click="handleDeleteUser(user)"
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
                        Mostrando {{ (currentPage - 1) * pageSize + 1 }} a {{ Math.min(currentPage * pageSize, totalUsers) }} de {{ totalUsers }} resultados
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

        <!-- User Modal -->
        <UserModal
            :is-open="isModalOpen"
            :user="selectedUser"
            :mode="modalMode"
            @close="isModalOpen = false"
            @save="handleSaveUser"
        />
    </div>
</template>
