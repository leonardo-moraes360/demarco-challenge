<script setup lang="ts">
import VoltCard from '@/volt/Card.vue';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  iconStyle?: string;
}

withDefaults(defineProps<Props>(), {
  iconStyle: 'text-2xl text-orange-500'
});
</script>

<template>
  <VoltCard class="h-full">
    <template #content>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
          <p class="text-3xl font-bold text-slate-100 mt-2">{{ value }}</p>
          <p v-if="subtitle" class="text-sm text-slate-400 mt-1">{{ subtitle }}</p>
        </div>
        <div v-if="icon" :class="iconStyle">
          <i :class="`pi ${icon}`" />
        </div>
      </div>
    </template>
  </VoltCard>
</template>
