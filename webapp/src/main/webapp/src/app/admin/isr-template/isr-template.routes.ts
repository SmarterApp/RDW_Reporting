import { IsrTemplateComponent } from './isr-template.component';
import { Route } from '@angular/router';

export const isrTemplateRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: IsrTemplateComponent
  }
];
