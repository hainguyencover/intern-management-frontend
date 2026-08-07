<template>
  <q-btn-dropdown flat dense icon="bookmark" label="Bộ lọc đã lưu" color="grey-8">
    <q-list dense style="min-width: 220px">
      <q-item v-for="item in savedFilters" :key="item.id" clickable v-close-popup @click="$emit('apply', item)">
        <q-item-section>
          <q-item-label class="text-bold">{{ item.name }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn flat round dense icon="delete" size="xs" color="negative" @click.stop="removeSavedFilter(item.id)" />
        </q-item-section>
      </q-item>

      <q-separator v-if="savedFilters.length" />

      <q-item clickable v-close-popup @click="saveCurrentFilter">
        <q-item-section avatar>
          <q-icon name="add" color="primary" />
        </q-item-section>
        <q-item-section class="text-primary text-bold">Lưu bộ lọc hiện tại...</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { SavedFilterConfig } from './filterTypes';

const props = defineProps<{
  currentFilters: Record<string, any>;
  storageKey?: string;
}>();

const emit = defineEmits<{
  (e: 'apply', filter: SavedFilterConfig): void;
}>();

const key = props.storageKey || 'holaho_saved_filters';
const savedFilters = ref<SavedFilterConfig[]>([]);

onMounted(() => {
  loadFromStorage();
});

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(key);
    if (raw) savedFilters.value = JSON.parse(raw);
  } catch {
    savedFilters.value = [];
  }
}

function saveCurrentFilter() {
  const name = prompt('Nhập tên gợi nhớ cho bộ lọc này:');
  if (!name || !name.trim()) return;

  const newItem: SavedFilterConfig = {
    id: 'sf-' + Date.now(),
    name: name.trim(),
    filters: { ...props.currentFilters }
  };
  savedFilters.value.push(newItem);
  localStorage.setItem(key, JSON.stringify(savedFilters.value));
}

function removeSavedFilter(id: string) {
  savedFilters.value = savedFilters.value.filter((f) => f.id !== id);
  localStorage.setItem(key, JSON.stringify(savedFilters.value));
}
</script>
