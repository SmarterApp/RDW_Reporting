import { Component } from '@angular/core';

interface Link {
  id: string;
  path: string;
  icon: string;
  permission: string;
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
    id: 'ingest-pipelines',
    path: '/ingest-pipelines',
    icon: 'fa-filter',
    permission: 'PIPELINE_READ'
  },
  {
    id: 'sandbox-config',
    path: '/sandboxes',
    icon: 'fa-cog',
    permission: 'TENANT_READ'
  },
  {
    id: 'tenant-config',
    path: '/tenants',
    icon: 'fa-cog',
    permission: 'TENANT_READ'
  }
];

@Component({
  selector: 'admin-tools',
  templateUrl: './admin-tools.component.html'
})
export class AdminToolsComponent {
  readonly links: Link[] = links;
  readonly permissions: string[] = links.map(({ permission }) => permission);
}
