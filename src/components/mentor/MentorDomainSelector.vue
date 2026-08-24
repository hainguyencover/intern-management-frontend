<template>
  <q-card flat bordered class="q-pa-md q-mb-md rounded-borders">
    <div class="row items-center justify-between q-mb-sm">
      <div class="text-h6 text-primary flex items-center gap-2">
        <q-icon name="category" size="24px" />
        <span>Lĩnh vực có thể hướng dẫn</span>
      </div>
      <q-btn color="primary" icon="save" label="Lưu lĩnh vực" dense unelevated :loading="saving" @click="handleSave" />
    </div>

    <div class="text-caption text-grey-7 q-mb-sm">
      Chọn các lĩnh vực bạn có đủ năng lực để hướng dẫn và đồng hành cùng thực tập sinh.
    </div>

    <div class="row q-gutter-xs">
      <q-chip
        v-for="domain in availableDomains"
        :key="domain.id"
        clickable
        :outline="!selectedIds.includes(domain.id)"
        :color="selectedIds.includes(domain.id) ? 'primary' : 'grey-7'"
        :text-color="selectedIds.includes(domain.id) ? 'white' : 'dark'"
        :icon="selectedIds.includes(domain.id) ? 'check' : 'add'"
        @click="toggleDomain(domain.id)"
      >
        {{ domain.name }}
      </q-chip>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { MentoringDomain } from '@/types/mentor';

const props = defineProps<{
  domains: MentoringDomain[];
  availableDomains: MentoringDomain[];
  saving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update-domains', domainIds: number[]): void;
}>();

const selectedIds = ref<number[]>([]);

watch(
  () => props.domains,
  (newDomains) => {
    selectedIds.value = newDomains ? newDomains.map((d) => d.id) : [];
  },
  { immediate: true }
);

function toggleDomain(id: number) {
  const index = selectedIds.value.indexOf(id);
  if (index >= 0) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(id);
  }
}

function handleSave() {
  emit('update-domains', [...selectedIds.value]);
}
</script>
