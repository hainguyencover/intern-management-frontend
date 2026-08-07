<template>
  <div class="column flex-center q-pa-xl text-center">
    <q-icon :name="icon" size="4rem" color="grey-5" class="q-mb-md" />
    <div class="text-h6 text-grey-8 text-bold">{{ title }}</div>
    <div v-if="description" class="text-body2 text-grey-6 q-mt-sm class-max-width">{{ description }}</div>
    <q-btn
      v-if="actionLabel"
      color="primary"
      :label="actionLabel"
      class="q-mt-lg rounded-btn"
      no-caps
      unelevated
      @click="$emit('action')"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
  }>(),
  {
    icon: 'inbox',
    title: 'Không có dữ liệu'
  }
);

defineEmits<{
  (e: 'action'): void;
}>();
</script>

<style scoped lang="sass">
.class-max-width
  max-width: 400px
.rounded-btn
  border-radius: 10px
</style>
