<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import Input from "@/common/components/Input.vue";
import Button from "@/common/components/Button.vue";
import Logo from "@/common/components/Logo.vue";
import AuthImage from "@/modules/auth/assets/auth.svg";
import { authStore } from "@/modules/auth/stores/auth";

const router = useRouter();
const auth = authStore();

const form = reactive({
  email: "",
  password: ""
});

const emailRef = ref<HTMLInputElement>();
const passwordRef = ref<HTMLInputElement>();

async function submit() {
  if (!form.email || !form.password) {
    auth.error = "Por favor, preencha todos os campos";
    return;
  }

  try {
    await auth.login({
      email: form.email,
      password: form.password
    });
    
    
    router.push("/");
  } catch (error: any) {    
    console.error("Erro no login:", error);
  }
}

function clearError() {
  auth.clearError();
}
</script>

<template>
    <div class="flex h-screen">
        <section
            class="grid place-items-center place-content-center bg-slate-950 w-[60%]"
        >
            <div class="mb-6">
                <Logo size="3xl" />
            </div>
            <div
                class="flex justify-center items-center bg-orange-100 w-full max-w-80 rounded-full aspect-square"
            >
                <img
                    :src="AuthImage"
                    alt="Entrar na sua conta"
                    class="w-[80%] h-auto object-contain"
                />
            </div>
        </section>
        <section
            class="grid place-items-center place-content-center w-[40%] px-9"
        >
            <div class="bg-white rounded-lg shadow px-4 py-6 w-full max-w-sm">
                <h2 class="font-bold text-xl mb-6">Login</h2>

                
                <form @submit.prevent="submit">
                    <fieldset class="flex flex-col gap-y-4 mb-6">
                        <legend class="text-xs text-neutral-500 mb-2">
                            Informações do usuário
                        </legend>
                        <Input 
                            ref="emailRef"
                            v-model="form.email"
                            type="email" 
                            placeholder="Seu email"
                            :disabled="auth.isLoading"
                            @input="clearError"
                        />
                        <Input 
                            ref="passwordRef"
                            v-model="form.password"
                            type="password" 
                            placeholder="Sua senha"
                            :disabled="auth.isLoading"
                            @input="clearError"
                        />
                        <div v-if="auth.error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                            {{ auth.error }}
                        </div>
                    </fieldset>
                    <Button 
                        class="w-full" 
                        type="submit"
                        :disabled="auth.isLoading"
                    >
                        {{ auth.isLoading ? 'Entrando...' : 'Entrar' }}
                    </Button>
                </form>
            </div>
        </section>
    </div>
</template>
