<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- Header -->
    <PageHeader :title="title" :subtitle="subtitle" :breadcrumbs="breadcrumbs">
      <template #actions>
        <slot name="actions" />
      </template>
    </PageHeader>

    <!-- Main Detail Card -->
    <BaseCard class="q-mb-lg">
      <div class="row items-center justify-between q-pb-md border-bottom">
        <div class="row items-center q-gutter-x-md">
          <slot name="avatar" />
          <div>
            <div class="text-h6 text-bold">{{ entityName }}</div>
            <div class="text-caption text-grey-6">{{ entityCode }}</div>
          </div>
        </div>
        <div class="row q-gutter-x-xs">
          <slot name="status-badges" />
        </div>
      </div>

      <!-- Tab Panels Navigation -->
      <div v-if="$slots.tabs" class="q-mt-md">
        <slot name="tabs" />
      </div>

      <!-- Detail Body Content -->
      <div class="q-mt-md">
        <slot name="content" />
      </div>
    </BaseCard>
  </q-page>
</template>

<script setup lang="ts">
import PageHeader, { type BreadcrumbItem } from './PageHeader.vue';
import BaseCard from '../components/BaseCard.vue';

defineProps<{
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  entityName: string;
  entityCode?: string;
}>();
</script>
