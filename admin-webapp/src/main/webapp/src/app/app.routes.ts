import { Routes } from "@angular/router";
import { UserResolve } from "./user/user.resolve";
import { GroupsComponent } from "./groups/groups.component";
import { GroupFilterOptionsResolve } from "./groups/group-filter-options.resolve";
import { AuthorizeCanActivate } from "./user/authorize.can-activate";
import { GroupImportComponent } from "./groups/import/group-import.component";
import { ImportHistoryComponent } from "./groups/import/history/import-history.component";
import { ImportHistoryResolve } from "./groups/import/history/import-history.resolve";
import { GroupImportDeactivateGuard } from "./groups/import/group-import.deactivate";
import { FileFormatComponent } from "./groups/import/fileformat/file-format.component";
import { AccessDeniedComponent } from "./access-denied/access-denied.component";
import { SessionExpiredComponent } from "@sbac/rdw-reporting-common-ngx";

export const routes: Routes = [
  {
    path: '',
    resolve: { user: UserResolve, filterOptions: GroupFilterOptionsResolve },
    data: { permissions: [ 'GROUP_WRITE' ] },
    canActivate: [ AuthorizeCanActivate ],
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'groups'
      },
      {
        path: 'groups',
        pathMatch: 'prefix',
        data: { breadcrumb: { translate: 'labels.groups.title' } },
        children: [
          {
            path: '',
            pathMatch: 'prefix',
            component: GroupsComponent
          },
          {
            path: 'import',
            pathMatch: 'prefix',
            data: { breadcrumb: { translate: 'labels.groups.import.title' } },
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
                data: { breadcrumb: { translate: 'labels.groups.import.file-format.header' } },
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
          {
            path: 'session-expired',
            pathMatch: 'full',
            component: SessionExpiredComponent
          }
        ]
      }
    ]
  }, {
    path: 'access-denied',
    pathMatch: 'full',
    component: AccessDeniedComponent
  }
];
