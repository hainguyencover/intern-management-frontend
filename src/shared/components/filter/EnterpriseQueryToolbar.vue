<template>
  <div class="enterprise-query-toolbar q-mb-md">
    <div class="row q-col-gutter-md items-center">
      <div class="col-12 col-md-6">
        <SearchToolbar
          :model-value="search"
          :placeholder="placeholder"
          @update:model-value="$emit('update:search', $event)"
          @search="$emit('search', $event)"
        />
      </div>
      <div class="col-12 col-md-6 row items-center justify-end q-gutter-x-sm">
        <SavedFilterManager
          :current-filters="activeFilters"
          :storage-key="storageKey"
          @apply="$emit('applySaved', $event)"
        />
      </div>
    </div>

    <!-- Active Filter Chips -->
    <ActiveFilterChips
      :chips="activeChips"
      @remove="$emit('removeFilter', $event)"
      @clear-all="$emit('clearFilters')"
    />
  </div>
</template>

<script setup lang="ts">
import SearchToolbar from './SearchToolbar.vue';
import ActiveFilterChips from './ActiveFilterChips.vue';
import SavedFilterManager from './SavedFilterManager.vue';
import type { ActiveChip, SavedFilterConfig } from './filterTypes';

defineProps<{
  search: string;
  activeFilters: Record<string, any>;
  activeChips: ActiveChip[];
  placeholder?: string;
  storageKey?: string;
}>();

defineEmits<{
  (e: 'update:search', val: string): void;
  (e: 'search', val: string): void;
  (e: 'removeFilter', key: string): void;
  (e: 'clearFilters'): void;
  (e: 'applySaved', config: SavedFilterConfig): void;
}>();
</script>
