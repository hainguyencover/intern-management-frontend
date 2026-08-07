<template>
  <div>
    <!-- Fullscreen Loading -->
    <q-inner-loading v-if="type === 'fullscreen' || type === 'overlay'" showing class="z-max">
      <q-spinner-gears size="50px" color="primary" />
      <div v-if="message" class="q-mt-md text-subtitle2 text-primary">{{ message }}</div>
    </q-inner-loading>

    <!-- Inline Loading -->
    <div v-else class="row justify-center q-pa-md">
      <q-spinner color="primary" size="3em" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'fullscreen' | 'inline' | 'overlay';
    message?: string;
  }>(),
  {
    type: 'inline'
  }
);
</script>
