import { Route } from '@angular/router';
import { TestResultsAvailabilityComponent } from './test-results-availability.component';

export const testResultsAvailabilityRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: TestResultsAvailabilityComponent
  }
];
