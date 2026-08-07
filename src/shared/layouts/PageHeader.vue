<template>
  <div class="page-header q-mb-lg">
    <!-- Breadcrumbs -->
    <q-breadcrumbs v-if="breadcrumbs && breadcrumbs.length" class="q-mb-xs text-caption text-grey-7">
      <q-breadcrumbs-el
        v-for="(b, idx) in breadcrumbs"
        :key="idx"
        :label="b.label"
        :icon="b.icon"
        :to="b.to"
      />
    </q-breadcrumbs>

    <!-- Header Title & Action Slots -->
    <div class="row items-center justify-between">
      <div>
        <h5 class="q-my-none text-bold text-primary">{{ title }}</h5>
        <div v-if="subtitle" class="text-subtitle2 text-grey-6 q-mt-xs">{{ subtitle }}</div>
      </div>
      <div class="row q-gutter-x-sm items-center">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  label: string;
  to?: string;
  icon?: string;
}

defineProps<{
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}>();
</script>
