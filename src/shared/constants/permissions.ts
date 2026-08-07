export const Permissions = {
  Auth: {
    Manage: 'auth:manage'
  },
  Task: {
    Read: 'task:read',
    Create: 'task:create',
    Update: 'task:update',
    Delete: 'task:delete',
    Review: 'task:review'
  },
  Intern: {
    Read: 'intern:read',
    Create: 'intern:create',
    Update: 'intern:update',
    Delete: 'intern:delete',
    Assign: 'intern:assign'
  },
  Department: {
    Read: 'dept:read',
    Create: 'dept:create',
    Update: 'dept:update',
    Delete: 'dept:delete'
  },
  Evaluation: {
    Read: 'eval:read',
    Create: 'eval:create',
    Update: 'eval:update',
    Delete: 'eval:delete',
    Review: 'eval:review',
    Approve: 'eval:approve'
  }
} as const;
