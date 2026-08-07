import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseDataTable from '../BaseDataTable.vue';

describe('BaseDataTable.vue', () => {
  const columns = [
    { name: 'id', label: 'ID', field: 'id', visible: true, required: true },
    { name: 'name', label: 'Tên', field: 'name', visible: true }
  ];

  const rows = [
    { id: '1', name: 'Thực tập sinh A' },
    { id: '2', name: 'Thực tập sinh B' }
  ];

  it('should render table rows and columns correctly', () => {
    const wrapper = mount(BaseDataTable, {
      props: {
        rows,
        columns,
        rowKey: 'id'
      }
    });

    expect(wrapper.text()).toContain('Thực tập sinh A');
    expect(wrapper.text()).toContain('Thực tập sinh B');
  });
});
