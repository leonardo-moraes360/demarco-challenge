<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import VoltDialog from '@/volt/Dialog.vue';
import VoltInputText from '@/volt/InputText.vue';

import VoltSelect from '@/volt/Select.vue';
import VoltButton from '@/volt/Button.vue';
import type { User } from '@/common/types/auth';

interface Props {
  isOpen: boolean;
  user?: User | null;
  loading?: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', user: Partial<User>): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

const form = ref({
  fullName: '',
  cpf: '',
  email: '',
  phone: '',
  position: '',
  birthDate: '',
  status: 'active' as 'active' | 'inactive'
});

const errors = ref<Record<string, string>>({});

const isEdit = computed(() => !!props.user);

const statusOptions = [
  { label: 'Ativo', value: 'active' },
  { label: 'Inativo', value: 'inactive' }
];

const resetForm = () => {
  form.value = {
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    position: '',
    birthDate: '',
    status: 'active'
  };
  errors.value = {};
};

const validateForm = () => {
  errors.value = {};

  if (!form.value.fullName.trim()) {
    errors.value.fullName = 'Nome é obrigatório';
  }

  if (!form.value.cpf.trim()) {
    errors.value.cpf = 'CPF é obrigatório';
  } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(form.value.cpf)) {
    errors.value.cpf = 'CPF deve estar no formato 000.000.000-00';
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'Email é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Email inválido';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', {
      ...form.value,
      birthDate: form.value.birthDate || undefined
    });
  }
};

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.user) {
      form.value = {
        fullName: props.user.fullName,
        cpf: props.user.cpf,
        email: props.user.email,
        phone: props.user.phone || '',
        position: props.user.position || '',
        birthDate: props.user.birthDate || '',
        status: props.user.status
      };
    } else {
      resetForm();
    }
  }
});
</script>

<template>
  <VoltDialog
    :visible="isOpen"
    :modal="true"
    :closable="true"
    :header="isEdit ? 'Editar Usuário' : 'Novo Usuário'"
    @update:visible="() => emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Nome Completo *
          </label>
          <VoltInputText
            v-model="form.fullName"
            :class="{ 'border-red-500': errors.fullName }"
            placeholder="Digite o nome completo"
            class="w-full"
            required
          />
          <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">
            {{ errors.fullName }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            CPF *
          </label>
          <VoltInputText
            v-model="form.cpf"
            :class="{ 'border-red-500': errors.cpf }"
            placeholder="000.000.000-00"
            class="w-full"
            required
          />
          <p v-if="errors.cpf" class="mt-1 text-sm text-red-600">
            {{ errors.cpf }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Email *
          </label>
          <VoltInputText
            v-model="form.email"
            type="email"
            :class="{ 'border-red-500': errors.email }"
            placeholder="Digite o email"
            class="w-full"
            required
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Telefone
          </label>
          <VoltInputText
            v-model="form.phone"
            placeholder="(00) 00000-0000"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Cargo
          </label>
          <VoltInputText
            v-model="form.position"
            placeholder="Digite o cargo"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Data de Nascimento
          </label>
          <VoltInputText
            v-model="form.birthDate"
            type="date"
            placeholder="Selecione a data"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Status *
          </label>
          <VoltSelect
            v-model="form.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecione o status"
            class="w-full"
            required
          />
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <VoltButton
          type="button"
          severity="secondary"
          @click="emit('close')"
        >
          Cancelar
        </VoltButton>
        <VoltButton
          type="submit"
          :loading="loading"
        >
          {{ isEdit ? 'Atualizar' : 'Criar' }}
        </VoltButton>
      </div>
    </form>
  </VoltDialog>
</template>
