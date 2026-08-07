<template>
  <q-avatar :size="avatarSize" :color="color" text-color="white" :icon="icon">
    <img v-if="src" :src="src" alt="Avatar" />
  </q-avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type AvatarSize = 'sm' | 'md' | 'lg';

const props = withDefaults(
  defineProps<{
    src?: string;
    icon?: string;
    color?: string;
    size?: AvatarSize;
  }>(),
  {
    color: 'primary',
    size: 'md'
  }
);

const avatarSize = computed(() => {
  const map: Record<AvatarSize, string> = {
    sm: '32px',
    md: '48px',
    lg: '64px'
  };
  return map[props.size];
});
</script>
