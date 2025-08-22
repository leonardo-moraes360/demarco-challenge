<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import VoltDialog from '@/volt/Dialog.vue';
import VoltInputText from '@/volt/InputText.vue';
import VoltSelect from '@/volt/Select.vue';
import VoltButton from '@/volt/Button.vue';
import type { MedicalCertificate, CreateMedicalCertificateRequest, UpdateMedicalCertificateRequest } from '@/common/types/medical-certificate';
import type { User } from '@/common/types/auth';

interface Props {
  isOpen: boolean;
  medicalCertificate?: MedicalCertificate | null;
  users: User[];
  loading?: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', certificate: CreateMedicalCertificateRequest | UpdateMedicalCertificateRequest): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

const form = ref({
  userBelongsToId: '',
  icd: '',
  icdVersion: 'ICD_10' as 'ICD_10' | 'ICD_11',
  startsAt: '',
  endsAt: '',
  file: null as File | null,
  status: 'active' as 'active' | 'inactive'
});

const isEdit = computed(() => !!props.medicalCertificate);

const statusOptions = [
  { label: 'Ativo', value: 'active' },
  { label: 'Inativo', value: 'inactive' }
];

const icdVersionOptions = [
  { label: 'CID-10', value: 'ICD_10' },
  { label: 'CID-11', value: 'ICD_11' }
];

const resetForm = () => {
  form.value = {
    userBelongsToId: '',
    icd: '',
    icdVersion: 'ICD_10',
    startsAt: '',
    endsAt: '',
    file: null,
    status: 'active'
  };
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    form.value.file = target.files[0];
  }
};

const handleSubmit = () => {
  if (isEdit.value) {
    // Update request - não inclui arquivo
    const updateData: UpdateMedicalCertificateRequest = {
      icd: form.value.icd,
      icdVersion: form.value.icdVersion,
      startsAt: form.value.startsAt,
      endsAt: form.value.endsAt,
      status: form.value.status
    };
    emit('submit', updateData);
  } else {
    // Create request - inclui arquivo obrigatório
    if (!form.value.file) {
      alert('Por favor, selecione um arquivo');
      return;
    }
    
    const createData: CreateMedicalCertificateRequest = {
      icd: form.value.icd,
      icdVersion: form.value.icdVersion,
      startsAt: form.value.startsAt,
      endsAt: form.value.endsAt,
      userBelongsToId: form.value.userBelongsToId,
      userCreatedById: '', // Será preenchido pelo serviço
      file: form.value.file
    };
    emit('submit', createData);
  }
};

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.medicalCertificate) {
      form.value = {
        userBelongsToId: props.medicalCertificate.userBelongsToId,
        icd: props.medicalCertificate.icd,
        icdVersion: props.medicalCertificate.icdVersion,
        startsAt: props.medicalCertificate.startsAt,
        endsAt: props.medicalCertificate.endsAt,
        file: null, // Não carregamos o arquivo no edit
        status: props.medicalCertificate.status
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
    :header="isEdit ? 'Editar Atestado' : 'Novo Atestado'"
    @update:visible="() => emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Paciente *
          </label>
          <VoltSelect
            v-model="form.userBelongsToId"
            :options="users"
            optionLabel="fullName"
            optionValue="id"
            placeholder="Selecione o paciente"
            class="w-full"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Código CID *
          </label>
          <VoltInputText
            v-model="form.icd"
            placeholder="Ex: E10.1"
            class="w-full"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Versão do CID *
          </label>
          <VoltSelect
            v-model="form.icdVersion"
            :options="icdVersionOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecione a versão"
            class="w-full"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Data de Início *
          </label>
          <VoltInputText
            v-model="form.startsAt"
            type="date"
            placeholder="Selecione a data de início"
            class="w-full"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Data de Fim *
          </label>
          <VoltInputText
            v-model="form.endsAt"
            type="date"
            placeholder="Selecione a data de fim"
            class="w-full"
            required
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Arquivo do Atestado *
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @change="handleFileChange"
            required
          />
          <p class="text-sm text-gray-500 mt-1">
            Formatos aceitos: PDF, JPG, JPEG, PNG (máximo 10MB)
          </p>
        </div>

        <div v-if="isEdit">
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
