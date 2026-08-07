import * as internService from './internService';
import type {
  InternProfile,
  CreateInternPayload,
  UpdateInternPayload,
  InternQuery,
  PageResponse
} from '../models/intern';

export class InternFacade {
  static async loadInterns(query?: InternQuery): Promise<PageResponse<InternProfile>> {
    return await internService.fetchInterns(query);
  }

  static async createIntern(payload: CreateInternPayload): Promise<InternProfile> {
    return await internService.createIntern(payload);
  }

  static async updateIntern(id: string, payload: UpdateInternPayload): Promise<InternProfile> {
    return await internService.updateIntern(id, payload);
  }

  static async deleteIntern(id: string): Promise<void> {
    await internService.deleteIntern(id);
  }
}
