import { Route } from '@angular/router';
import { HasAnyPermissionCanActivate } from '../shared/security/can-activate/has-any-permission.can-activate';

export const aggregateReportBreadcrumb = ({ translateService }) =>
  translateService.instant('aggregate-reports.heading');

export const testResultsAvailabilityBreadcrumb = ({ translateService }) =>
  translateService.instant('test-results-availability.title');

export const organizationExportBreadcrumb = ({ translateService }) =>
  translateService.instant('organization-export.title');

export const groupsBreadcrumb = ({ translateService }) =>
  translateService.instant('admin-groups.title');

export const instructionalResourceBreadcrumb = ({ translateService }) =>
  translateService.instant('instructional-resource.title');

export const pipelinesBreadcrumb = ({ translateService }) =>
  translateService.instant('pipelines.heading');

export const sandboxesBreadcrumb = ({ translateService }) =>
  translateService.instant('tenants.heading.SANDBOX');

export const tenantsBreadcrumb = ({ translateService }) =>
  translateService.instant('tenants.heading.TENANT');

export const isrTemplateBreadcrumb = ({ translateService }) =>
  translateService.instant('isr-template.title');

export const adminRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'aggregate-reports',
        loadChildren:
          'app/aggregate-report/aggregate-reports.module#AggregateReportsModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: aggregateReportBreadcrumb,
          permissions: ['CUSTOM_AGGREGATE_READ']
        }
      },
      {
        path: 'custom-export',
        loadChildren:
          'app/organization-export/organization-export.module#OrganizationExportModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: organizationExportBreadcrumb,
          permissions: ['INDIVIDUAL_PII_READ']
        }
      },
      {
        path: 'admin-groups',
        loadChildren: 'app/admin/groups/groups.module#GroupsModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: groupsBreadcrumb,
          permissions: ['GROUP_WRITE']
        }
      },
      {
        path: 'instructional-resource',
        loadChildren:
          'app/admin/instructional-resource/instructional-resource.module#InstructionalResourceModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: instructionalResourceBreadcrumb,
          permissions: ['INSTRUCTIONAL_RESOURCE_WRITE']
        }
      },
      {
        path: 'ingest-pipelines',
        loadChildren:
          'app/admin/ingest-pipeline/ingest-pipeline.module#IngestPipelineModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: pipelinesBreadcrumb,
          permissions: ['PIPELINE_READ']
        }
      },
      {
        path: 'sandboxes',
        loadChildren: 'app/admin/tenant/tenant.module#TenantModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: sandboxesBreadcrumb,
          permissions: ['TENANT_READ'],
          type: 'SANDBOX'
        }
      },
      {
        path: 'tenants',
        loadChildren: 'app/admin/tenant/tenant.module#TenantModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: tenantsBreadcrumb,
          permissions: ['TENANT_READ'],
          type: 'TENANT'
        }
      },
      {
        path: 'test-results-availability',
        loadChildren:
          'app/admin/test-results-availability/test-results-availability.module#TestResultsAvailabilityModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: testResultsAvailabilityBreadcrumb,
          permissions: ['TEST_DATA_REVIEWING_WRITE', 'TEST_DATA_LOADING_WRITE']
        }
      },
      {
        path: 'isr-template',
        loadChildren:
          'app/admin/isr-template/isr-template.module#IsrTemplateModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: isrTemplateBreadcrumb,
          permissions: ['ISR_TEMPLATE_READ']
        }
      }
    ]
  }
];
