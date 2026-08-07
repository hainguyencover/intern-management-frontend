<template>
  <q-timeline color="primary" class="q-px-md">
    <q-timeline-entry
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :subtitle="item.timestamp"
      :icon="item.icon || 'history'"
      :color="item.color || 'primary'"
    >
      <div>
        <div v-if="item.description" class="text-body2 text-grey-9">{{ item.description }}</div>
        <div v-if="item.reason" class="text-caption text-grey-7 q-mt-xs"><strong>Lý do:</strong> {{ item.reason }}</div>
        <div v-if="item.actor" class="text-caption text-grey-6 q-mt-xs">Thực hiện bởi: {{ item.actor }}</div>
      </div>
    </q-timeline-entry>

    <div v-if="!items.length" class="text-center text-grey-6 q-pa-md">
      Chưa có lịch sử thay đổi.
    </div>
  </q-timeline>
</template>

<script setup lang="ts">
export interface AuditTimelineItem {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
  reason?: string;
  actor?: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

defineProps<{
  items: AuditTimelineItem[];
}>();
</script>
