<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- Header -->
    <slot name="header">
      <PageHeader v-if="title" :title="title" :subtitle="subtitle" :breadcrumbs="breadcrumbs">
        <template #actions>
          <slot name="header-actions" />
        </template>
      </PageHeader>
    </slot>

    <!-- Toolbar / Filters -->
    <div v-if="$slots.toolbar" class="q-mb-md">
      <slot name="toolbar" />
    </div>

    <!-- Main Content -->
    <div class="q-mb-lg">
      <slot name="content" />
    </div>

    <!-- Pagination / Footer -->
    <div v-if="$slots.pagination" class="row justify-center">
      <slot name="pagination" />
    </div>

    <!-- Optional Drawer / Side Modal -->
    <slot name="drawer" />
  </q-page>
</template>

<script setup lang="ts">
import PageHeader, { type BreadcrumbItem } from './PageHeader.vue';

defineProps<{
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}>();
</script>
