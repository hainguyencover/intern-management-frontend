export interface AuditLogItem {
  id: number;
  tenantId?: number;
  actorId?: number;
  actorUsername?: string;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  entityType?: string;
  entityId?: number;
  result: 'SUCCESS' | 'FAILED' | 'DENIED' | string;
  status?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  message?: string;
  beforeJson?: string;
  afterJson?: string;
  oldValue?: string;
  newValue?: string;
  metadata?: string;
  createdAt: string;
}

export interface AuditLogFilter {
  actorId?: number;
  actorUsername?: string;
  actorRole?: string;
  action?: string;
  resourceType?: string;
  result?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}
