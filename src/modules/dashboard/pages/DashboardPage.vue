<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- Header Controls -->
    <DashboardHeader
      :time-range="timeRange"
      :loading="loading"
      @update:time-range="changeTimeRange"
      @refresh="refresh"
    />

    <!-- Skeleton Loading State -->
    <BaseSkeleton v-if="loading && !kpis.length" type="card" :rows="4" />

    <!-- Main Content -->
    <template v-else>
      <!-- Row 1: KPI Stat Cards -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div
          v-for="kpi in kpis"
          :key="kpi.id"
          class="col-12 col-sm-6 col-md-3"
        >
          <KpiStatCard
            :title="kpi.title"
            :value="kpi.value"
            :change-percentage="kpi.changePercentage"
            :trend="kpi.trend"
            :icon="kpi.icon"
            :color="kpi.color"
          />
        </div>
      </div>

      <!-- Row 2: Dynamic Registered Widgets with Independent Error Boundaries -->
      <div class="row q-col-gutter-lg">
        <BaseWidgetWrapper
          v-for="widget in registeredWidgets"
          :key="widget.id"
          :title="widget.title"
          :component="widget.component"
          :grid-col="widget.gridCol"
          :permission="widget.permission"
          :component-props="getWidgetProps(widget.id)"
        />
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DashboardHeader from '../components/DashboardHeader.vue';
import KpiStatCard from '../components/KpiStatCard.vue';
import BaseWidgetWrapper from '../components/BaseWidgetWrapper.vue';
import BaseSkeleton from '../../../shared/components/BaseSkeleton.vue';
import { useDashboard } from '../composables/useDashboard';
import { widgetRegistry } from '../registry/widgetRegistry';

const {
  kpis,
  activities,
  timeRange,
  loading,
  changeTimeRange,
  refresh
} = useDashboard();

const registeredWidgets = computed(() => widgetRegistry.getWidgets());

function getWidgetProps(widgetId: string) {
  if (widgetId === 'recent-activity-widget') {
    return { activities: activities.value };
  }
  return {};
}
</script>
