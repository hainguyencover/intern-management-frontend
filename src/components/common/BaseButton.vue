<template>
  <q-btn
    :color="color"
    :label="label"
    :icon="icon"
    :loading="loading"
    :disable="disable"
    :outline="outline"
    :flat="flat"
    :unelevated="unelevated"
    :size="size"
    @click="$emit('click', $event)"
  >
    <slot />
  </q-btn>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    icon?: string;
    color?: string;
    loading?: boolean;
    disable?: boolean;
    outline?: boolean;
    flat?: boolean;
    unelevated?: boolean;
    size?: string;
  }>(),
  {
    color: 'primary',
    loading: false,
    disable: false,
    outline: false,
    flat: false,
    unelevated: false,
    size: 'md'
  }
);

defineEmits<{
  (e: 'click', event: Event): void;
}>();
</script>
