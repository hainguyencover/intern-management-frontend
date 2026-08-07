export interface DataTableColumn<T = any> {
  name: string;
  label: string;
  field: string | ((row: T) => any);
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  visible?: boolean;
  required?: boolean;
}

export interface BulkAction<T = any> {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  permission?: string;
  handler: (selectedRows: T[]) => void | Promise<void>;
}
