import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EnterpriseQueryToolbar from '../filter/EnterpriseQueryToolbar.vue';

describe('EnterpriseQueryToolbar.vue', () => {
  it('should render search placeholder and active filter chips', () => {
    const activeChips = [
      { key: 'status', label: 'Trạng thái', displayValue: 'ACTIVE' }
    ];

    const wrapper = mount(EnterpriseQueryToolbar, {
      props: {
        search: '',
        activeFilters: { status: 'ACTIVE' },
        activeChips,
        placeholder: 'Tìm kiếm hồ sơ...'
      }
    });

    expect(wrapper.html()).toContain('Tìm kiếm hồ sơ...');
    expect(wrapper.text()).toContain('Trạng thái: ACTIVE');
  });
});
