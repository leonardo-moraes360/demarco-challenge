<script setup lang="ts">
import { computed } from "vue";

type Size = keyof typeof sizes;

const sizes = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
} as const;

;

const props = defineProps<{ 
    size?: Size, 
    full?: boolean 
    center?: boolean
}>();

const computedClass = computed((): string[] => {
    return ["flex items-baseline text-white", sizes[props.size ?? "base"], props.full ? "w-full" : "", props.center ? "justify-center" : ""];
});
</script>

<template>
    <h1 :class="computedClass">
        <span class="font-black shrink-0 leading-0 text-orange-500">.</span>
        <span class="font-bold text-white">Collaborators</span>
    </h1>
</template>
