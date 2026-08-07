<template>
  <q-dialog :model-value="modelValue" @update:model-value="(val) => $emit('update:modelValue', val)">
    <q-card class="forbidden-action-card text-center q-pa-xl" style="min-width: 360px">
      <q-icon name="block" size="4rem" color="negative" class="q-mb-md" />
      <div class="text-h6 text-bold q-mb-sm">Thao tác bị từ chối</div>
      <div class="text-body2 text-grey-6 q-mb-lg">
        Bạn không có đủ quyền hạn để thực hiện thao tác này. Vui lòng liên hệ Quản trị viên để biết thêm chi tiết.
      </div>
      <BaseButton label="Đã hiểu" color="primary" block @click="$emit('update:modelValue', false)" />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import BaseButton from '../../../shared/components/BaseButton.vue';

defineProps<{
  modelValue: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style scoped lang="sass">
.forbidden-action-card
  border-radius: 16px
</style>
