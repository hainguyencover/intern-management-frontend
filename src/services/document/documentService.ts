import apiClient from '@/services/api/apiClient';
import type { InternDocument, DocumentType } from '@/types/document';

export const documentService = {
  async getDocuments(internProfileId?: number): Promise<InternDocument[]> {
    const { data } = await apiClient.get<InternDocument[]>('/interns/documents', {
      params: { internProfileId }
    });
    return data;
  },

  async uploadDocument(file: File, fileType: DocumentType, notes?: string): Promise<InternDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    if (notes) formData.append('notes', notes);

    const { data } = await apiClient.post<InternDocument>('/interns/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  async deleteDocument(id: number): Promise<void> {
    await apiClient.delete(`/interns/documents/${id}`);
  },

  async approveDocument(id: number, status: 'APPROVED' | 'REJECTED', notes?: string): Promise<InternDocument> {
    const { data } = await apiClient.patch<InternDocument>(`/interns/documents/${id}/review`, {
      status,
      notes
    });
    return data;
  }
};

export default documentService;
