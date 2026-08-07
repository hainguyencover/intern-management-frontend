<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6 text-bold">{{ fileName }}</div>
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section class="text-center">
        <img v-if="imageUrl" :src="imageUrl" style="max-width: 100%; max-height: 300px; object-fit: contain" />
        <div v-else class="q-pa-lg text-grey-7">
          <q-icon name="insert_drive_file" size="64px" />
          <div class="q-mt-sm">Xem trước không khả dụng cho tập tin này</div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  fileName: string;
  imageUrl?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();
</script>
