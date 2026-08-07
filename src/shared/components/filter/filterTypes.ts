export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'boolean';
  options?: FilterOption[];
  defaultValue?: any;
}

export interface QuickFilterItem {
  id: string;
  label: string;
  filter: Record<string, any>;
}

export interface SavedFilterConfig {
  id: string;
  name: string;
  filters: Record<string, any>;
  search?: string;
}

export interface ActiveChip {
  key: string;
  label: string;
  displayValue: string;
}
