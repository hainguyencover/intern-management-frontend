<template>
  <div class="q-pa-md full-width">
    <!-- Table Skeleton -->
    <div v-if="type === 'table'">
      <q-markup-table flat bordered class="rounded-card">
        <thead>
          <tr>
            <th class="text-left" style="width: 150px">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-left">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-left">
              <q-skeleton animation="blink" type="text" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in rows" :key="n">
            <td><q-skeleton animation="blink" type="text" /></td>
            <td><q-skeleton animation="blink" type="text" /></td>
            <td><q-skeleton animation="blink" type="text" /></td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <!-- Card Skeleton -->
    <div v-else-if="type === 'card'" class="row q-col-gutter-md">
      <div v-for="n in rows" :key="n" class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card">
          <q-card-section>
            <q-skeleton type="rect" class="q-mb-sm" />
            <q-skeleton type="text" class="q-mb-xs" />
            <q-skeleton type="text" width="60%" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Form/List Default Skeleton -->
    <div v-else>
      <q-skeleton type="rect" class="q-mb-md" />
      <q-skeleton type="text" class="q-mb-sm" />
      <q-skeleton type="text" width="80%" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type: 'table' | 'card' | 'list' | 'form';
    rows?: number;
  }>(),
  {
    rows: 3
  }
);
</script>

<style scoped lang="sass">
.rounded-card
  border-radius: 12px
</style>
