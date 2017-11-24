import { Routes } from "@angular/router";
import { UserResolve } from "./user/user.resolve";
import { AuthorizeCanActivate } from "./user/authorize.can-activate";
import { AccessDeniedComponent } from "./access-denied/access-denied.component";
import { SessionExpiredComponent } from "@sbac/rdw-reporting-common-ngx";
import { InstructionalResourceComponent } from "./instructional-resource/instructional-resource.component";
import { HomeComponent } from "./home/home.component";
import { ImportHistoryComponent } from "./groups/import/history/import-history.component";
import { ImportHistoryResolve } from "./groups/import/history/import-history.resolve";
import { FileFormatComponent } from "./groups/import/fileformat/file-format.component";
import { GroupImportDeactivateGuard } from "./groups/import/group-import.deactivate";
import { GroupImportComponent } from "./groups/import/group-import.component";
import { GroupsComponent } from "./groups/groups.component";

export const routes: Routes = [
  {
    path: '',
    resolve: { user: UserResolve },
    canActivate: [ AuthorizeCanActivate ],
    data: {
      permissions: [ 'GROUP_WRITE', 'INSTRUCTIONAL_RESOURCE_WRITE' ]
    },
    children: [
      {
        path: 'home',
        pathMatch: 'prefix',
        redirectTo: ''
      },
      {
        path: '',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: HomeComponent
          },
          {
            path: 'groups',
            pathMatch: 'prefix',
            data: {
              breadcrumb: {
                translate: 'labels.groups.title',
              },
              permissions: [ 'GROUP_WRITE' ]
            },
            canActivate: [ AuthorizeCanActivate ],
            component: GroupsComponent
          },
          {
            path: 'import',
            pathMatch: 'prefix',
            data: {
              breadcrumb: { translate: 'labels.groups.import.title' }, permissions: [ 'GROUP_WRITE' ]
            },
            canActivate: [ AuthorizeCanActivate ],
            children: [
              {
                path: '',
                pathMatch: 'prefix',
                component: GroupImportComponent,
                canDeactivate: [ GroupImportDeactivateGuard ]
              },
              {
                path: 'fileformat',
                pathMatch: 'prefix',
                data: {
                  breadcrumb: { translate: 'labels.groups.import.file-format.header' }
                },
                children: [
                  {
                    path: '',
                    pathMatch: 'prefix',
                    component: FileFormatComponent
                  }
                ]
              }
            ]
          },
          {
            path: 'history',
            pathMatch: 'prefix',
            data: {
              permissions: [ 'GROUP_WRITE' ]
            },
            canActivate: [ AuthorizeCanActivate ],
            children: [
              {
                path: '',
                pathMatch: 'prefix',
                component: ImportHistoryComponent,
                resolve: { imports: ImportHistoryResolve },
                data: { breadcrumb: { translate: 'labels.groups.history.title' } }
              }
            ]
          },
        ]
      },
      {
        path: 'instructional-resource',
        pathMatch: 'prefix',
        data: {
          breadcrumb: { translate: 'labels.instructional-resource.title' },
          permissions: [ 'INSTRUCTIONAL_RESOURCE_WRITE' ]
        },
        children: [
          {
            path: '',
            pathMatch: 'prefix',
            component: InstructionalResourceComponent
          }
        ]
      },
      {
        path: 'access-denied',
        pathMatch: 'full',
        component: AccessDeniedComponent
      },
      {
        path: 'session-expired',
        pathMatch: 'full',
        component: SessionExpiredComponent
      } ]
  } ];
