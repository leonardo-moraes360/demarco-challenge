import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { AuthService } from "@/common/services/auth.service";
import type { User, LoginRequest } from "@/common/types/auth";

export const authStore = defineStore("auth", () => {
  const user = ref<User | null>(AuthService.getCurrentUser());
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => {
    return !!user.value && AuthService.isAuthenticated();
  });

  async function login(credentials: LoginRequest) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await AuthService.login(credentials);
      user.value = response.user;
      return response;
    } catch (err: any) {
      error.value = err.message || 'Erro ao fazer login';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    try {
      await AuthService.logout();
    } finally {
      user.value = null;
      error.value = null;
    }
  }

  async function logoutAllSessions() {
    try {
      await AuthService.logoutAllSessions();
    } finally {
      user.value = null;
      error.value = null;
    }
  }

  async function refreshToken() {
    try {
      const response = await AuthService.refreshToken();
      user.value = response.user;
      return response;
    } catch (err: any) {      
      await logout();
      throw err;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    logoutAllSessions,
    refreshToken,
    clearError
  };
});
