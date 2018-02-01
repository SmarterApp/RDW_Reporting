import { HomeComponent } from "./home/home.component";
import { Routes } from "@angular/router";
import { GroupResultsComponent } from "./groups/results/group-results.component";
import { GroupAssessmentsResolve } from "./groups/results/group-assessments.resolve";
import { UserResolve } from "./user/user.resolve";
import { SchoolAssessmentResolve } from "./school-grade/results/school-assessments.resolve";
import { SchoolResultsComponent } from "./school-grade/results/school-results.component";
import { CurrentSchoolResolve } from "./school-grade/results/current-school.resolve";
import { StudentResultsComponent } from "./student/results/student-results.component";
import { StudentExamHistoryResolve } from "./student/results/student-exam-history.resolve";
import { StudentResponsesResolve } from "./student/responses/student-responses.resolve";
import { StudentResponsesComponent } from "./student/responses/student-responses.component";
import { TranslateResolve } from "./home/translate.resolve";
import { StudentHistoryResponsesExamResolve } from "./student/responses/student-history-responses-exam.resolve";
import { StudentHistoryResponsesAssessmentResolve } from "./student/responses/student-history-responses-assessment.resolve";
import { StudentHistoryResponsesStudentResolve } from "./student/responses/student-history-responses-student.resolve";
import { ReportsResolve } from "./report/reports.resolve";
import { ReportsComponent } from "./report/reports.component";
import { ErrorComponent } from "./error/error.component";
import { AccessDeniedComponent } from "./error/access-denied/access-denied.component";
import { OrganizationExportComponent } from "./organization-export/organization-export.component";
import { UserOrganizationsResolve } from "./organization-export/organization/user-organizations.resolve";
import { InstructionalResourceComponent } from "./admin/instructional-resource/instructional-resource.component";
import { EmbargoComponent } from "./admin/embargo/embargo.component";
import { EmbargoResolve } from "./admin/embargo/embargo.resolve";
import { ImportHistoryComponent } from "./admin/groups/import/history/import-history.component";
import { FileFormatComponent } from "./admin/groups/import/fileformat/file-format.component";
import { ImportHistoryResolve } from "./admin/groups/import/history/import-history.resolve";
import { GroupImportComponent } from "./admin/groups/import/group-import.component";
import { GroupImportDeactivateGuard } from "./admin/groups/import/group-import.deactivate";
import { GroupsComponent } from "./admin/groups/groups.component";
import { HomeComponent as AdminHomeComponent } from "./admin/home/home.component";
import { QueryBuilderComponent } from "./aggregate-report/results/query-builder.component";
import { SessionExpiredComponent } from "./shared/security/session-expired.component";
import { AuthorizationCanActivate } from "./shared/security/authorization.can-activate";
import { RoutingAuthorizationCanActivate } from "./shared/security/routing-authorization.can-activate";
import { AggregateReportFormResolve } from "./aggregate-report/aggregate-report-form.resolve";
import { AggregateReportComponent } from "./aggregate-report/results/aggregate-report.component";
import { AggregateReportFormComponent } from "./aggregate-report/aggregate-report-form.component";
import { AggregateReportResolve } from "./aggregate-report/results/aggregate-report.resolve";

const adminRoute = {
  path: 'admin',
  data: { breadcrumb: { translate: 'labels.admin.title' }, permissions: [ 'GROUP_WRITE', 'INSTRUCTIONAL_RESOURCE_WRITE', 'EMBARGO_WRITE' ] },
  canActivate: [ AuthorizationCanActivate ],
  children: [
    {
      path: '',
      pathMatch: 'full',
      component: AdminHomeComponent
    },
    {
      path: 'admin-groups',
      pathMatch: 'prefix',
      data: {
        breadcrumb: {
          translate: 'labels.admin-groups.title',
        },
        permissions: [ 'GROUP_WRITE' ],
        denyAccess: true
      },
      canActivate: [ AuthorizationCanActivate ],
      children: [
        {
          path: '',
          pathMatch: 'prefix',
          component: GroupsComponent
        },
        {
          path: 'import',
          data: {
            breadcrumb: { translate: 'labels.admin-groups.import.title' },
          },
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
                breadcrumb: { translate: 'labels.admin-groups.import.file-format.header' }
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
          children: [
            {
              path: '',
              pathMatch: 'prefix',
              component: ImportHistoryComponent,
              resolve: { imports: ImportHistoryResolve },
              data: { breadcrumb: { translate: 'labels.admin-groups.history.title' } }
            }
          ]
        }
      ]
    },
    {
      path: 'instructional-resource',
      pathMatch: 'prefix',
      data: {
        breadcrumb: { translate: 'labels.instructional-resource.title' },
        permissions: [ 'INSTRUCTIONAL_RESOURCE_WRITE' ],
        denyAccess: true
      },
      canActivate: [ AuthorizationCanActivate ],
      children: [
        {
          path: '',
          pathMatch: 'prefix',
          component: InstructionalResourceComponent
        }
      ]
    },
    {
      path: 'embargoes',
      pathMatch: 'prefix',
      data: {
        breadcrumb: { translate: 'labels.embargo.title' },
        permissions: [ 'EMBARGO_WRITE' ]
      },
      canActivate: [ AuthorizationCanActivate ],
      children: [
        {
          path: '',
          pathMatch: 'prefix',
          component: EmbargoComponent,
          resolve: { embargoesByOrganizationType: EmbargoResolve }
        }
      ]
    }

  ]
};


const studentTestHistoryChildRoute = {
  path: 'students/:studentId',
  resolve: { examHistory: StudentExamHistoryResolve },
  data: {
    breadcrumb: {
      translate: 'labels.student.results.crumb',
      translateResolve: 'examHistory.student'
    },
  },
  children: [
    {
      path: '',
      data: { canReuse: true },
      pathMatch: 'full',
      component: StudentResultsComponent
    },
    {
      path: 'exams/:examId',
      pathMatch: 'full',
      resolve: {
        assessment: StudentHistoryResponsesAssessmentResolve,
        assessmentItems: StudentResponsesResolve,
        exam: StudentHistoryResponsesExamResolve,
        student: StudentHistoryResponsesStudentResolve
      },
      data: {
        breadcrumb: {
          translate: 'labels.student.responses.crumb'
        }
      },
      component: StudentResponsesComponent
    }
  ]
};

export const routes: Routes = [
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    canActivate: [ RoutingAuthorizationCanActivate ],
    resolve: { user: UserResolve, translateComplete: TranslateResolve },
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      adminRoute,
      {
        path: 'groups/:groupId',
        data: { breadcrumb: { translate: 'labels.groups.name' }, permissions: [ 'GROUP_PII_READ' ] },
        canActivate: [ AuthorizationCanActivate ],
        children: [
          {
            path: '',
            pathMatch: 'full',
            data: { canReuse: true },
            resolve: { assessment: GroupAssessmentsResolve },
            component: GroupResultsComponent
          },
          studentTestHistoryChildRoute
        ]
      },
      {
        path: 'schools/:schoolId',
        data: { breadcrumb: { resolve: 'school.name' }, permissions: [ 'INDIVIDUAL_PII_READ' ] },
        resolve: { school: CurrentSchoolResolve },
        canActivate: [ AuthorizationCanActivate ],
        children: [
          {
            path: '',
            pathMatch: 'full',
            data: { canReuse: true },
            resolve: { assessment: SchoolAssessmentResolve, school: CurrentSchoolResolve },
            component: SchoolResultsComponent
          },
          studentTestHistoryChildRoute
        ]
      },
      {
        path: 'students/:studentId',
        resolve: { examHistory: StudentExamHistoryResolve },
        data: {
          breadcrumb: {
            translate: 'labels.student.results.crumb',
            translateResolve: 'examHistory.student'
          },
          permissions: [ 'GROUP_PII_READ' ]
        },
        canActivate: [ AuthorizationCanActivate ],
        children: [
          {
            path: '',
            data: { canReuse: true },
            pathMatch: 'full',
            component: StudentResultsComponent
          },
          {
            path: 'exams/:examId',
            pathMatch: 'full',
            resolve: {
              assessment: StudentHistoryResponsesAssessmentResolve,
              assessmentItems: StudentResponsesResolve,
              exam: StudentHistoryResponsesExamResolve,
              student: StudentHistoryResponsesStudentResolve
            },
            data: { breadcrumb: { translate: 'labels.student.responses.crumb' } },
            component: StudentResponsesComponent
          }
        ]
      },
      {
        path: 'reports',
        pathMatch: 'full',
        data: {
          breadcrumb: { translate: 'labels.reports.heading' }, permissions: [ 'GROUP_PII_READ' ]},
        canActivate: [ AuthorizationCanActivate ],
        resolve: { reports: ReportsResolve },
        component: ReportsComponent
      },
      {
        path: 'aggregate-reports',
        data: { breadcrumb: { translate: 'aggregate-reports.heading'}, permissions: [ 'CUSTOM_AGGREGATE_READ' ]},
        canActivate: [ AuthorizationCanActivate ],
        children: [
          {
            path: '',
            data: { canReuse: true },
            resolve: { form: AggregateReportFormResolve },
            pathMatch: 'full',
            component: AggregateReportFormComponent
          },
          {
            path: ':id',
            pathMatch: 'full',
            data: { breadcrumb: { translate: 'aggregate-reports.results.heading'}},
            resolve: { report: AggregateReportResolve },
            component: AggregateReportComponent
          },
          {
            path: 'query-builder',
            pathMatch: 'full',
            data: { breadcrumb: { translate: 'aggregate-reports.query-builder.heading'}},
            resolve: { organizations: UserOrganizationsResolve },
            component: QueryBuilderComponent
          }
        ]
      },
      {
        path: 'custom-export',
        pathMatch: 'full',
        data: { breadcrumb: { translate: 'labels.organization-export.title' }, permissions: [ 'INDIVIDUAL_PII_READ' ]},
        canActivate: [ AuthorizationCanActivate ],
        resolve: { organizations: UserOrganizationsResolve },
        component: OrganizationExportComponent
      },
      {
        path: 'session-expired',
        pathMatch: 'full',
        component: SessionExpiredComponent
      },
      {
        path: 'error',
        pathMatch: 'full',
        component: ErrorComponent
      }
    ]
  },
  {
    path: 'access-denied',
    pathMatch: 'full',
    component: AccessDeniedComponent
  }
];
