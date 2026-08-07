<template>
  <q-dialog
    :model-value="modelValue"
    :persistent="persistent"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <q-card class="rounded-dialog" style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">{{ title }}</div>
        <q-space />
        <q-btn
          v-close-popup
          icon="close"
          flat
          round
          dense
          :disabled="disabled || loading"
          @click="$emit('cancel')"
        />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <slot />
      </q-card-section>

      <q-card-actions v-if="$slots.actions" align="right" class="bg-white text-teal q-pb-md q-pr-md">
        <slot name="actions" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    persistent?: boolean;
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    persistent: false,
    disabled: false,
    loading: false
  }
);

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<style scoped lang="sass">
.rounded-dialog
  border-radius: 16px
</style>
