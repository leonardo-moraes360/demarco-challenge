import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { UsersService, type CreateUserRequest, type UpdateUserRequest, type UsersQueryParams } from "@/common/services/users.service";
import type { User } from "@/common/types/auth";

export const usersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const activeUsers = ref<User[]>([]);
  const totalUsers = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const searchName = ref('');
  const searchCpf = ref('');
  const filterStatus = ref<'active' | 'inactive' | ''>('');

  const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value));
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPrevPage = computed(() => currentPage.value > 1);
  
  const activeUsersOptions = computed(() => 
    activeUsers.value.map(user => ({
      label: user.fullName,
      value: user.id
    }))
  );
  async function loadUsers(params?: UsersQueryParams) {
    try {
      isLoading.value = true;
      error.value = null;
      
      const queryParams: UsersQueryParams = params || {
        page: currentPage.value,
        page_size: pageSize.value,
        name: searchName.value || undefined,
        cpf: searchCpf.value || undefined,
        status: filterStatus.value || undefined
      };
      
      const response = await UsersService.getUsers(queryParams);
      users.value = response.data;
      totalUsers.value = response.count;
      
      return response;
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar usuários';
      console.error('Erro ao carregar usuários:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadActiveUsers() {
    try {
      if (activeUsers.value.length > 0) {
        return activeUsers.value;
      }

      const response = await UsersService.getUsers({ 
        page_size: 100, 
        status: 'active' 
      });
      activeUsers.value = response.data;
      
      return activeUsers.value;
    } catch (err: any) {
      console.error('Erro ao carregar usuários ativos:', err);
      throw err;
    }
  }

  async function createUser(data: CreateUserRequest) {
    try {
      const user = await UsersService.createUser(data);
      
      if (user.status === 'active') {
        activeUsers.value.push(user);
      }
      
      await loadUsers();
      
      return user;
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar usuário';
      console.error('Erro ao criar usuário:', err);
      throw err;
    }
  }

  async function updateUser(id: string, data: UpdateUserRequest) {
    try {
      const updatedUser = await UsersService.updateUser(id, data);
      
      const index = users.value.findIndex(u => u.id === id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
      const activeIndex = activeUsers.value.findIndex(u => u.id === id);
      if (updatedUser.status === 'active') {
        if (activeIndex !== -1) {
          activeUsers.value[activeIndex] = updatedUser;
        } else {
          activeUsers.value.push(updatedUser);
        }
      } else if (activeIndex !== -1) {
        activeUsers.value.splice(activeIndex, 1);
      }
      
      return updatedUser;
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar usuário';
      console.error('Erro ao atualizar usuário:', err);
      throw err;
    }
  }

  async function deleteUser(id: string) {
    try {
      await UsersService.deleteUser(id);
      
      const index = users.value.findIndex(u => u.id === id);
      if (index !== -1) {
        users.value.splice(index, 1);
        totalUsers.value--;
      }
      const activeIndex = activeUsers.value.findIndex(u => u.id === id);
      if (activeIndex !== -1) {
        activeUsers.value.splice(activeIndex, 1);
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao excluir usuário';
      console.error('Erro ao excluir usuário:', err);
      throw err;
    }
  }

  function setPage(page: number) {
    currentPage.value = page;
  }

  function setPageSize(size: number) {
    pageSize.value = size;
    currentPage.value = 1;
  }

  function setFilters(filters: {
    name?: string;
    cpf?: string;
    status?: 'active' | 'inactive' | '';
  }) {
    if (filters.name !== undefined) searchName.value = filters.name;
    if (filters.cpf !== undefined) searchCpf.value = filters.cpf;
    if (filters.status !== undefined) filterStatus.value = filters.status;
    currentPage.value = 1;
  }

  function clearFilters() {
    searchName.value = '';
    searchCpf.value = '';
    filterStatus.value = '';
    currentPage.value = 1;
  }

  function clearError() {
    error.value = null;
  }

  function invalidateActiveUsersCache() {
    activeUsers.value = [];
  }

  return {
    users,
    activeUsers,
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
    hasPrevPage,
    activeUsersOptions,
    loadUsers,
    loadActiveUsers,
    createUser,
    updateUser,
    deleteUser,
    setPage,
    setPageSize,
    setFilters,
    clearFilters,
    clearError,
    invalidateActiveUsersCache
  };
});
