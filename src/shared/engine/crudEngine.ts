import { defineStore } from 'pinia';
import type { PageResponse } from '../../modules/intern/models/intern';

export interface CrudServiceAdapter<TEntity extends { id: string }, TCreate = any, TUpdate = any> {
  fetchAll: (query?: any) => Promise<PageResponse<TEntity>>;
  fetchById?: (id: string) => Promise<TEntity>;
  create?: (payload: TCreate) => Promise<TEntity>;
  update?: (id: string, payload: TUpdate) => Promise<TEntity>;
  delete?: (id: string) => Promise<void>;
}

export function createCrudStore<TEntity extends { id: string }, TCreate = any, TUpdate = any>(
  storeId: string,
  service: CrudServiceAdapter<TEntity, TCreate, TUpdate>
) {
  return defineStore(storeId, {
    state: () => ({
      items: [] as TEntity[],
      activeItem: null as TEntity | null,
      totalElements: 0,
      totalPages: 1,
      page: 1,
      limit: 10,
      search: '',
      loading: false,
      error: null as string | null
    }),

    actions: {
      async fetchAll(query?: any): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
          const res = await service.fetchAll({
            page: query?.page || this.page,
            limit: query?.limit || this.limit,
            search: query?.search !== undefined ? query.search : this.search
          });
          this.items = res.content;
          this.totalElements = res.totalElements;
          this.totalPages = res.totalPages;
          this.page = res.page;
        } catch (err: any) {
          this.error = err?.message || 'Không thể tải dữ liệu.';
        } finally {
          this.loading = false;
        }
      },

      async fetchById(id: string): Promise<TEntity | null> {
        if (!service.fetchById) return null;
        this.loading = true;
        try {
          const item = await service.fetchById(id);
          this.activeItem = item;
          return item;
        } catch (err: any) {
          this.error = err?.message || 'Không tìm thấy đối tượng.';
          return null;
        } finally {
          this.loading = false;
        }
      },

      async create(payload: TCreate): Promise<TEntity | null> {
        if (!service.create) return null;
        this.loading = true;
        try {
          const newItem = await service.create(payload);
          this.items.unshift(newItem);
          this.totalElements++;
          return newItem;
        } catch (err: any) {
          this.error = err?.message || 'Không thể tạo mới.';
          return null;
        } finally {
          this.loading = false;
        }
      },

      async update(id: string, payload: TUpdate): Promise<TEntity | null> {
        if (!service.update) return null;
        this.loading = true;
        try {
          const updated = await service.update(id, payload);
          const index = this.items.findIndex((i) => i.id === id);
          if (index !== -1) {
            this.items[index] = updated;
          }
          return updated;
        } catch (err: any) {
          this.error = err?.message || 'Không thể cập nhật.';
          return null;
        } finally {
          this.loading = false;
        }
      },

      async delete(id: string): Promise<boolean> {
        if (!service.delete) return false;
        const originalItems = [...this.items];
        // Optimistic delete
        this.items = this.items.filter((i) => i.id !== id);
        try {
          await service.delete(id);
          this.totalElements--;
          return true;
        } catch (err: any) {
          // Rollback
          this.items = originalItems;
          this.error = err?.message || 'Không thể xóa.';
          return false;
        }
      }
    }
  });
}
