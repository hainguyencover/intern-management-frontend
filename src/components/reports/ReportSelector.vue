<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section>
      <div class="text-subtitle1 text-weight-bold text-primary q-mb-sm">
        <q-icon name="analytics" class="q-mr-xs" /> Chọn loại báo cáo
      </div>
      <div class="row q-col-gutter-sm">
        <div
          v-for="item in catalog"
          :key="item.code"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card
            flat
            bordered
            clickable
            v-ripple
            :class="[
              'cursor-pointer transition-generic',
              selectedCode === item.code ? 'bg-blue-1 border-primary text-primary shadow-1' : 'bg-white text-grey-9'
            ]"
            @click="$emit('select', item.code)"
          >
            <q-card-section class="q-pa-sm">
              <div class="row items-center no-wrap">
                <q-avatar
                  size="36px"
                  :color="selectedCode === item.code ? 'primary' : 'grey-3'"
                  :text-color="selectedCode === item.code ? 'white' : 'grey-7'"
                  class="q-mr-sm"
                >
                  <q-icon :name="getCategoryIcon(item.category)" size="20px" />
                </q-avatar>
                <div>
                  <div class="text-weight-bold text-body2 line-clamp-1">{{ item.name }}</div>
                  <div class="text-caption text-grey-6 line-clamp-1">{{ item.description }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { ReportCatalogDto } from '@/types/report';

defineProps<{
  catalog: ReportCatalogDto[];
  selectedCode?: string;
}>();

defineEmits<{
  (e: 'select', code: string): void;
}>();

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'Academic Reports': return 'school';
    case 'Mentor Reports': return 'supervisor_account';
    case 'Performance Reports': return 'trending_up';
    case 'Operations Reports': return 'event_available';
    case 'Finance Reports': return 'payments';
    case 'Legal Reports': return 'gavel';
    case 'Executive Reports': return 'dashboard';
    default: return 'description';
  }
}
</script>

<style scoped>
.border-primary {
  border: 2px solid var(--q-primary) !important;
}
.transition-generic {
  transition: all 0.2s ease-in-out;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
