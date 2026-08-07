import { markRaw } from 'vue';
import InternDistributionWidget from '../components/InternDistributionWidget.vue';
import RecentActivityList from '../components/RecentActivityList.vue';

export interface WidgetDefinition {
  id: string;
  title: string;
  component: any;
  permission?: string;
  role?: string;
  gridCol: string;
}

class WidgetRegistry {
  private widgets: WidgetDefinition[] = [];

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    this.register({
      id: 'distribution-widget',
      title: 'Phân bổ thực tập sinh',
      component: markRaw(InternDistributionWidget),
      gridCol: 'col-12 col-md-7'
    });

    this.register({
      id: 'recent-activity-widget',
      title: 'Hoạt động gần đây',
      component: markRaw(RecentActivityList),
      gridCol: 'col-12 col-md-5'
    });
  }

  register(widget: WidgetDefinition): void {
    const existing = this.widgets.findIndex((w) => w.id === widget.id);
    if (existing >= 0) {
      this.widgets[existing] = widget;
    } else {
      this.widgets.push(widget);
    }
  }

  getWidgets(): WidgetDefinition[] {
    return [...this.widgets];
  }
}

export const widgetRegistry = new WidgetRegistry();
