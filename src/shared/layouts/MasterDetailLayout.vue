<template>
  <q-page class="q-pa-lg bg-grey-2">
    <PageHeader v-if="title" :title="title" :subtitle="subtitle" :breadcrumbs="breadcrumbs">
      <template #actions>
        <slot name="header-actions" />
      </template>
    </PageHeader>

    <div class="row q-col-gutter-lg">
      <!-- Master Panel (Left) -->
      <div class="col-12 col-md-5">
        <BaseCard>
          <slot name="master" />
        </BaseCard>
      </div>

      <!-- Detail Panel (Right) -->
      <div class="col-12 col-md-7">
        <BaseCard>
          <slot name="detail" />
        </BaseCard>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import PageHeader, { type BreadcrumbItem } from './PageHeader.vue';
import BaseCard from '../components/BaseCard.vue';

defineProps<{
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}>();
</script>
