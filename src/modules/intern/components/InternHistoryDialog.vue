<template>
  <BaseDialog
    :model-value="modelValue"
    :title="`Lịch sử thay đổi hồ sơ: ${internName}`"
    :loading="loading"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @cancel="$emit('update:modelValue', false)"
  >
    <div v-if="history && history.length > 0" class="q-py-sm">
      <q-timeline color="primary">
        <q-timeline-entry
          v-for="item in history"
          :key="item.id"
          :title="getTimelineTitle(item)"
          :subtitle="item.createdAt"
          :icon="getTimelineIcon(item.action)"
          :color="getTimelineColor(item.action)"
        >
          <div>
            <div class="text-body2 text-grey-9">{{ item.message || 'Thay đổi thông tin hồ sơ' }}</div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Thực hiện bởi: <strong>{{ item.actorEmail || 'N/A' }}</strong>
            </div>
          </div>
        </q-timeline-entry>
      </q-timeline>
    </div>
    <div v-else class="text-center q-pa-lg text-grey-7">
      <q-icon name="history_toggle_off" size="48px" class="q-mb-sm text-grey-5" />
      <div>Chưa có dữ liệu lịch sử thay đổi cho hồ sơ này.</div>
    </div>

    <template #actions>
      <BaseButton flat label="Đóng" color="secondary" @click="$emit('update:modelValue', false)" />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../../../shared/components/BaseDialog.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';

defineProps<{
  modelValue: boolean;
  internName: string;
  history: any[];
  loading?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

function getTimelineTitle(item: any): string {
  switch (item.action) {
    case 'CREATE': return 'Khởi tạo hồ sơ';
    case 'UPDATE': return 'Chỉnh sửa thông tin hồ sơ';
    case 'DELETE': return 'Xóa hồ sơ';
    default: return item.action || 'Nhật ký thao tác';
  }
}

function getTimelineIcon(action: string): string {
  switch (action) {
    case 'CREATE': return 'person_add';
    case 'UPDATE': return 'edit';
    case 'DELETE': return 'delete';
    default: return 'event_note';
  }
}

function getTimelineColor(action: string): string {
  switch (action) {
    case 'CREATE': return 'positive';
    case 'UPDATE': return 'primary';
    case 'DELETE': return 'negative';
    default: return 'grey';
  }
}
</script>
