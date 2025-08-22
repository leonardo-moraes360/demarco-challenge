<script setup lang="ts">
import { computed } from 'vue';
import VoltInputText from '@/volt/InputText.vue';

interface Props {
  modelValue?: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  size?: 'small' | 'normal' | 'large';
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'input', event: Event): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'keyup.enter', event: KeyboardEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  required: false,
  size: 'normal'
});

const emit = defineEmits<Emits>();

const id = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
});

const inputSize = computed(() => {
  switch (props.size) {
    case 'small':
      return 'small';
    case 'large':
      return 'large';
    default:
      return undefined;
  }
});

const handleInput = (event: Event) => {
  emit('input', event);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('keyup.enter', event);
  }
};
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-slate-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <VoltInputText
      :id="id"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :size="inputSize"
      class="w-full bg-white border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @keyup="handleKeyup"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

