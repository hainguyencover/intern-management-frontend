<template>
  <div class="row q-col-gutter-md">
    <div
      v-for="(item, idx) in items"
      :key="idx"
      class="col-12 col-sm-6 col-md-4 col-lg-3"
    >
      <slot name="card" :item="item" :index="idx" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
defineProps<{
  items: T[];
}>();
</script>
