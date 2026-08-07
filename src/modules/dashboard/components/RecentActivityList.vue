<template>
  <BaseCard title="Hoạt động gần đây" subtitle="Nhật ký tương tác thời gian thực">
    <q-list separator class="q-pt-xs">
      <q-item v-for="item in activities" :key="item.id" class="q-py-md">
        <q-item-section avatar>
          <BaseAvatar icon="person" color="primary" size="md" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold">{{ item.user }}</q-item-label>
          <q-item-label caption class="text-grey-7">{{ item.action }}</q-item-label>
        </q-item-section>

        <q-item-section side class="items-end">
          <BaseBadge :label="item.timestamp" color="secondary" />
        </q-item-section>
      </q-item>

      <div v-if="!activities.length" class="text-center text-grey-6 q-pa-md">
        Không có hoạt động nào gần đây.
      </div>
    </q-list>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '../../../shared/components/BaseCard.vue';
import BaseAvatar from '../../../shared/components/BaseAvatar.vue';
import BaseBadge from '../../../shared/components/BaseBadge.vue';
import type { RecentActivity } from '../models/dashboard';

defineProps<{
  activities: RecentActivity[];
}>();
</script>
