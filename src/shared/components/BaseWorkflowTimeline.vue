<template>
  <q-timeline color="primary" class="q-px-md">
    <q-timeline-entry
      v-for="item in records"
      :key="item.id"
      :title="`Chuyển đổi: ${item.from} → ${item.to}`"
      :subtitle="item.timestamp"
      icon="swap_horiz"
      color="primary"
    >
      <div>
        <div class="text-caption text-bold text-primary">Sự kiện: {{ item.event }}</div>
        <div v-if="item.actor" class="text-caption text-grey-6 q-mt-xs">Thực hiện bởi: {{ item.actor }}</div>
      </div>
    </q-timeline-entry>

    <div v-if="!records.length" class="text-center text-grey-6 q-pa-md">
      Chưa có lịch sử chuyển đổi workflow.
    </div>
  </q-timeline>
</template>

<script setup lang="ts">
import type { WorkflowHistoryRecord } from '../engine/workflow/workflowTypes';

defineProps<{
  records: WorkflowHistoryRecord[];
}>();
</script>
