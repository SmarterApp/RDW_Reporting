import { Route } from '@angular/router';
import { SandboxesComponent } from './pages/sandboxes/sandboxes.component';
import { NewSandboxConfigurationComponent } from './pages/new-sandbox.component';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { NewTenantConfigurationComponent } from './pages/new-tenant.component';
import { HasAnyPermissionCanActivate } from '../../shared/security/can-activate/has-any-permission.can-activate';

export const tenantRoutes: Route[] = [
  {
    path: 'sandboxes',
    pathMatch: 'prefix',
    data: {
      breadcrumb: { translate: 'sandbox-config.title' },
      permissions: ['TENANT_READ']
    },
    canActivate: [HasAnyPermissionCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        component: SandboxesComponent
      },
      {
        path: 'new',
        pathMatch: 'prefix',
        data: {
          breadcrumb: { translate: 'sandbox-config.new-sandbox.header' },
          permissions: ['TENANT_WRITE']
        },
        canActivate: [HasAnyPermissionCanActivate],
        children: [
          {
            path: '',
            pathMatch: 'prefix',
            component: NewSandboxConfigurationComponent
          }
        ]
      }
    ]
  },
  {
    path: 'tenants',
    pathMatch: 'prefix',
    data: {
      breadcrumb: { translate: 'tenant-config.title' },
      permissions: ['TENANT_READ']
    },
    canActivate: [HasAnyPermissionCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        component: TenantsComponent
      },
      {
        path: 'new',
        pathMatch: 'prefix',
        data: {
          breadcrumb: { translate: 'tenant-config.new-tenant.header' },
          permissions: ['TENANT_WRITE']
        },
        children: [
          {
            path: '',
            pathMatch: 'prefix',
            component: NewTenantConfigurationComponent
          }
        ]
      }
    ]
  }
];
