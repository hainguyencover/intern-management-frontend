<template>
  <q-btn
    :color="color"
    :label="label"
    :loading="loading"
    :disabled="disabled || loading"
    :icon="icon"
    :class="{ 'full-width': block, 'rounded-btn': true }"
    no-caps
    unelevated
    @click="$emit('click')"
  >
    <slot />
  </q-btn>
</template>

<script setup lang="ts">
type ButtonColor = 'primary' | 'secondary' | 'negative';

withDefaults(
  defineProps<{
    label?: string;
    color?: ButtonColor;
    loading?: boolean;
    disabled?: boolean;
    icon?: string;
    block?: boolean;
  }>(),
  {
    color: 'primary',
    loading: false,
    disabled: false,
    block: false
  }
);

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style scoped lang="sass">
.rounded-btn
  border-radius: 10px
  font-weight: 500
  transition: all 0.15s ease-in-out
</style>
