<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { IcdService, type IcdEntity } from '@/common/services/icd.service';
import VoltAutoComplete from '@/volt/AutoComplete.vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'select', icd: IcdEntity): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Digite para buscar CID...',
  disabled: false,
  required: false
});

const emit = defineEmits<Emits>();

const searchQuery = ref('');
const searchResults = ref<IcdEntity[]>([]);
const isLoading = ref(false);
const selectedIcd = ref<IcdEntity | null>(null);

const suggestions = computed(() => {
  return searchResults.value.map(icd => ({
    label: `${icd.code || ''} - ${icd.title}`,
    value: icd.id,
    data: icd
  }));
});

const searchIcd = async (query: string) => {
  if (!query || query.length < 2) {
    searchResults.value = [];
    return;
  }

  try {
    isLoading.value = true;
    const response = await IcdService.searchIcd({
      q: query,
      limit: 10
    });
    searchResults.value = response.entities;
  } catch (error) {
    console.error('Erro ao buscar CID:', error);
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = (event: any) => {
  const query = event.query;
  searchQuery.value = query;
  searchIcd(query);
};

const handleSelect = (suggestion: any) => {
  if (suggestion && suggestion.data) {
    selectedIcd.value = suggestion.data;
    const displayValue = `${suggestion.data.code || ''} - ${suggestion.data.title}`;
    emit('update:modelValue', displayValue);
    emit('select', suggestion.data);
  }
};

const handleInput = (value: string) => {
  emit('update:modelValue', value);
  if (!value) {
    selectedIcd.value = null;
    searchResults.value = [];
  }
};

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    selectedIcd.value = null;
    searchResults.value = [];
  }
});
</script>

<template>
  <div class="w-full">
    <VoltAutoComplete
      :model-value="modelValue"
      :suggestions="suggestions"
      :loading="isLoading"
      :disabled="disabled"
      :placeholder="placeholder"
      :required="required"
      option-label="label"
      option-value="value"
      :delay="300"
      :min-length="2"
      @search="handleSearch"
      @item-select="handleSelect"
      @update:model-value="handleInput"
      class="w-full"
    >
      <template #item="{ item }">
        <div class="flex flex-col">
          <div class="font-medium text-slate-900">
            {{ item.label }}
          </div>
          <div v-if="item.data.definition" class="text-sm text-slate-600 truncate">
            {{ item.data.definition }}
          </div>
        </div>
      </template>
    </VoltAutoComplete>
  </div>
</template>
