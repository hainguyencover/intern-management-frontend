<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <q-card class="session-expired-card text-center q-pa-xl" style="min-width: 380px">
      <q-icon name="lock_clock" size="4rem" color="warning" class="q-mb-md" />

      <div class="text-h6 text-bold q-mb-sm">Phiên đăng nhập đã hết hạn</div>

      <div class="text-body2 text-grey-6 q-mb-lg">
        Vì lý do bảo mật, phiên làm việc của bạn đã kết thúc.
        <br />Vui lòng đăng nhập lại để tiếp tục.
      </div>

      <BaseButton
        label="Đăng nhập lại"
        color="primary"
        block
        @click="$emit('relogin')"
      />
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
  (e: 'relogin'): void;
}>();
</script>

<style scoped lang="sass">
.session-expired-card
  border-radius: 16px
</style>
