<script setup lang="ts">
import { computed } from 'vue';
import VoltButton from '@/volt/Button.vue';

interface Props {
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'error' | 'danger';
  size?: 'small' | 'normal' | 'large';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

interface Emits {
  (e: 'click', event: MouseEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
  severity: 'primary',
  size: 'normal',
  loading: false,
  disabled: false,
  type: 'button'
});

const emit = defineEmits<Emits>();

const buttonSize = computed(() => {
  switch (props.size) {
    case 'small':
      return 'small';
    case 'large':
      return 'large';
    default:
      return undefined;
  }
});

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<template>
  <VoltButton
    :severity="severity"
    :size="buttonSize"
    :loading="loading"
    :disabled="disabled"
    :type="type"
    @click="handleClick"
  >
    <slot />
  </VoltButton>
</template>
