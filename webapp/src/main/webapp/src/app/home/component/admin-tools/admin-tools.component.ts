import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApplicationSettingsService } from '../../../app-settings.service';
import { ApplicationSettings } from '../../../app-settings';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../../shared/security/service/user.service';

interface Link {
  id: string;
  path: string;
  icon: string;
  permission: string;
  disabled?: (settings: ApplicationSettings) => boolean;
}

const links: Link[] = [
  {
    id: 'custom-aggregate',
    path: '/aggregate-reports',
    icon: 'fa-table',
    permission: 'CUSTOM_AGGREGATE_READ'
  },
  {
    id: 'organizational-export',
    path: '/custom-export',
    icon: 'fa-cloud-download',
    permission: 'INDIVIDUAL_PII_READ'
  },
  {
    id: 'student-groups',
    path: '/admin-groups',
    icon: 'fa-edit',
    permission: 'GROUP_WRITE'
  },
  {
    id: 'instructional-resources',
    path: '/instructional-resource',
    icon: 'fa-bold fa-calendar',
    permission: 'INSTRUCTIONAL_RESOURCE_WRITE'
  },
  {
    id: 'embargo',
    path: '/embargoes',
    icon: 'fa-eye-slash',
    permission: 'EMBARGO_WRITE'
  },
  {
    id: 'test-results-availability',
    path: '/test-results-availability',
    icon: 'fa-eye-slash',
    permission: 'TEST_DATA_REVIEWING_WRITE||TEST_DATA_LOADING_WRITE'
  },
  {
    id: 'ingest-pipelines',
    path: '/ingest-pipelines',
    icon: 'fa-filter',
    permission: 'PIPELINE_READ'
  },
  {
    id: 'sandboxes',
    path: '/sandboxes',
    icon: 'fa-cog',
    permission: 'TENANT_READ',
    disabled: ({ tenantAdministrationDisabled }) => tenantAdministrationDisabled
  },
  {
    id: 'tenants',
    path: '/tenants',
    icon: 'fa-cog',
    permission: 'TENANT_READ',
    disabled: ({ tenantAdministrationDisabled }) => tenantAdministrationDisabled
  },
  {
    id: 'isr-template',
    path: '/isr-template',
    icon: 'fa-cog',
    permission: 'ISR_TEMPLATE_READ'
  }
];

@Component({
  selector: 'admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminToolsComponent {
  readonly links$: Observable<Link[]>;
  readonly permissions: string[] = links.map(({ permission }) => permission);

  constructor(
    private settingsService: ApplicationSettingsService,
    private userService: UserService
  ) {
    this.links$ = forkJoin(
      settingsService.getSettings(),
      userService.getUser()
    ).pipe(
      map(([settings, user]) =>
        links.filter(
          link =>
            (link.disabled == null || !link.disabled(settings)) &&
            (link.permission == null ||
              link.permission
                .split('||')
                .some(perm => user.permissions.includes(perm)))
        )
      )
    );
  }
}
