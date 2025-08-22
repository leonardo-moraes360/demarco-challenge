<script setup lang="ts">
import { RouterView } from "vue-router";
import Menu from "@/common/components/Menu.vue";
</script>

<template>
    <main class="flex min-h-screen">
        <Menu />
        <section class="flex-1 p-8 overflow-auto">
            <RouterView />
        </section>
    </main>
</template>
