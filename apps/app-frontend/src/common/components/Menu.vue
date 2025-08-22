<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { Home, User, LogOut, UserCircle, FileText } from "lucide-vue-next";
import { authStore } from "@/modules/auth/stores/auth";
import Logo from "@/common/components/Logo.vue";

const router = useRouter();
const auth = authStore();

async function handleLogout() {
  try {
    await auth.logout();
    
    router.push("/login");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}
</script>

<template>
    <aside class="bg-slate-950 h-screen p-4 flex flex-col sticky top-0 left-0 w-64 flex-shrink-0">
        <div class="text-center mb-6 w-full">
            <Logo full center size="lg" />
        </div>        
        <div v-if="auth.user" class="mb-6 p-3 bg-slate-800 rounded-lg">
            <div class="flex items-center gap-x-2 mb-2">
                <UserCircle class="w-5 h-5 text-orange-500" />
                <span class="text-white text-sm font-medium">{{ auth.user.fullName }}</span>
            </div>
            <p class="text-slate-400 text-xs">{{ auth.user.email }}</p>
        </div>
        
        <nav class="flex flex-col gap-y-4 flex-1">
            <RouterLink
                to="/"
                class="flex items-center gap-x-1 text-white text-sm font-medium aria-[current=page]:text-orange-500 hover:text-orange-400 transition-colors"
            >
                <span><Home class="w-5 h-5" /></span>
                <span>Home</span>
            </RouterLink>
            <RouterLink
                to="/users"
                class="flex items-center gap-x-1 text-white text-sm font-medium aria-[current=page]:text-orange-500 hover:text-orange-400 transition-colors"
            >
                <span><User class="w-5 h-5" /></span>
                <span>Colaboradores</span>
            </RouterLink>
            <RouterLink
                to="/medical-certificates"
                class="flex items-center gap-x-1 text-white text-sm font-medium aria-[current=page]:text-orange-500 hover:text-orange-400 transition-colors"
            >
                <span><FileText class="w-5 h-5" /></span>
                <span>Atestados</span>
            </RouterLink>
        </nav>
        <div class="mt-auto">
            <button
                @click="handleLogout"
                class="flex items-center gap-x-1 text-white text-sm font-medium hover:text-red-400 transition-colors w-full"
            >
                <span><LogOut class="w-5 h-5" /></span>
                <span>Sair</span>
            </button>
        </div>
    </aside>
</template>
