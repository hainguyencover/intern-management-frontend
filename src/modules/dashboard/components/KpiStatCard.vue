<template>
  <BaseCard flat bordered class="kpi-card">
    <div class="row items-center justify-between no-wrap">
      <div>
        <div class="text-caption text-grey-6 text-bold text-uppercase">{{ title }}</div>
        <div class="text-h4 text-bold q-my-xs">{{ value }}</div>
        <div class="row items-center text-caption" :class="trendClass">
          <q-icon :name="trendIcon" class="q-mr-xs" />
          <span>{{ changePercentage > 0 ? '+' : '' }}{{ changePercentage }}% so với kỳ trước</span>
        </div>
      </div>
      <BaseAvatar :icon="icon" :color="color" size="lg" />
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseCard from '../../../shared/components/BaseCard.vue';
import BaseAvatar from '../../../shared/components/BaseAvatar.vue';

const props = defineProps<{
  title: string;
  value: number | string;
  changePercentage: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}>();

const trendClass = computed(() => {
  if (props.trend === 'up') return 'text-positive';
  if (props.trend === 'down') return 'text-negative';
  return 'text-grey-6';
});

const trendIcon = computed(() => {
  if (props.trend === 'up') return 'trending_up';
  if (props.trend === 'down') return 'trending_down';
  return 'trending_flat';
});
</script>

<style scoped lang="sass">
.kpi-card
  border-radius: 12px
  transition: transform 0.15s ease-in-out
  &:hover
    transform: translateY(-2px)
</style>
