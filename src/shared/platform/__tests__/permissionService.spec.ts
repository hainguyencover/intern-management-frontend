import { describe, it, expect, vi } from 'vitest';
import { PermissionResolverService } from '../permissionService';

// Mock Pinia store
vi.mock('../../modules/auth/store/authStore', () => ({
  useAuthStore: () => ({
    user: { id: '1' },
    roles: ['ADMIN'],
    permissions: []
  })
}));

describe('permissionService (PermissionResolverService)', () => {
  it('should grant access to admin roles', () => {
    const service = new PermissionResolverService();
    expect(service.can('any:permission')).toBe(true);
    expect(service.hasRole('ADMIN')).toBe(true);
  });
});
