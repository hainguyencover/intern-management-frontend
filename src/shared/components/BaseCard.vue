<template>
  <q-card
    :flat="flat"
    :bordered="bordered"
    class="rounded-card"
  >
    <q-card-section v-if="title || subtitle">
      <div v-if="title" class="text-h6 text-bold">{{ title }}</div>
      <div v-if="subtitle" class="text-subtitle2 text-grey-6">{{ subtitle }}</div>
    </q-card-section>

    <q-card-section>
      <slot />
    </q-card-section>

    <q-card-actions v-if="$slots.actions" align="right" class="q-pt-none">
      <slot name="actions" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    bordered?: boolean;
    flat?: boolean;
  }>(),
  {
    bordered: true,
    flat: true
  }
);
</script>

<style scoped lang="sass">
.rounded-card
  border-radius: 12px
</style>
