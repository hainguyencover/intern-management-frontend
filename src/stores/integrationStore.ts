import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IntegrationConnection, SyncJob } from '@/types/integration';
import * as integrationService from '@/services/integrationService';

export const useIntegrationStore = defineStore('integration', () => {
  const connections = ref<IntegrationConnection[]>([]);
  const loading = ref(false);
  const syncHistory = ref<SyncJob[]>([]);
  const activeJob = ref<SyncJob | null>(null);

  async function fetchConnections() {
    loading.value = true;
    try {
      connections.value = await integrationService.getConnections();
    } finally {
      loading.value = false;
    }
  }

  async function testConnection(id: number) {
    return await integrationService.testConnection(id);
  }

  async function triggerSync(connectionId: number) {
    const job = await integrationService.triggerHrmSync(connectionId);
    activeJob.value = job;
    return job;
  }

  async function fetchHistory(connectionId: number) {
    syncHistory.value = await integrationService.getSyncJobHistory(connectionId);
  }

  return {
    connections,
    loading,
    syncHistory,
    activeJob,
    fetchConnections,
    testConnection,
    triggerSync,
    fetchHistory
  };
});
