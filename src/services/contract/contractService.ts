import apiClient from '@/services/api/apiClient';
import type { Contract, ContractUploadRequest } from '@/types/contract';

export const contractService = {
  async getContracts(internProfileId?: number): Promise<Contract[]> {
    const { data } = await apiClient.get<Contract[]>('/contracts', {
      params: { internProfileId }
    });
    return data;
  },

  async uploadContract(req: ContractUploadRequest): Promise<Contract> {
    const formData = new FormData();
    formData.append('internProfileId', req.internProfileId.toString());
    formData.append('contractNumber', req.contractNumber);
    formData.append('startDate', req.startDate);
    formData.append('endDate', req.endDate);
    formData.append('file', req.file);

    const { data } = await apiClient.post<Contract>('/contracts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  async confirmContract(id: number): Promise<Contract> {
    const { data } = await apiClient.post<Contract>(`/contracts/${id}/confirm`);
    return data;
  }
};

export default contractService;
