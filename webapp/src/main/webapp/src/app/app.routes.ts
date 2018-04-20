import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
import { GroupResultsComponent } from './groups/results/group-results.component';
import { GroupAssessmentsResolve } from './groups/results/group-assessments.resolve';
import { SchoolAssessmentResolve } from './school-grade/results/school-assessments.resolve';
import { SchoolResultsComponent } from './school-grade/results/school-results.component';
import { CurrentSchoolResolve } from './school-grade/results/current-school.resolve';
import { StudentResultsComponent } from './student/results/student-results.component';
import { StudentExamHistoryResolve } from './student/results/student-exam-history.resolve';
import { StudentResponsesResolve } from './student/responses/student-responses.resolve';
import { StudentResponsesComponent } from './student/responses/student-responses.component';
import { TranslateResolve } from './home/translate.resolve';
import { StudentHistoryResponsesExamResolve } from './student/responses/student-history-responses-exam.resolve';
import { StudentHistoryResponsesAssessmentResolve } from './student/responses/student-history-responses-assessment.resolve';
import { StudentHistoryResponsesStudentResolve } from './student/responses/student-history-responses-student.resolve';
import { ReportsResolve } from './report/reports.resolve';
import { ReportsComponent } from './report/reports.component';
import { ErrorComponent } from './error/error.component';
import { AccessDeniedComponent } from './error/access-denied/access-denied.component';
import { OrganizationExportComponent } from './organization-export/organization-export.component';
import { UserOrganizationsResolve } from './organization-export/organization/user-organizations.resolve';
import { InstructionalResourceComponent } from './admin/instructional-resource/instructional-resource.component';
import { EmbargoComponent } from './admin/embargo/embargo.component';
import { EmbargoResolve } from './admin/embargo/embargo.resolve';
import { ImportHistoryComponent } from './admin/groups/import/history/import-history.component';
import { FileFormatComponent } from './admin/groups/import/fileformat/file-format.component';
import { ImportHistoryResolve } from './admin/groups/import/history/import-history.resolve';
import { GroupImportComponent } from './admin/groups/import/group-import.component';
import { GroupImportDeactivateGuard } from './admin/groups/import/group-import.deactivate';
import { GroupsComponent } from './admin/groups/groups.component';
import { SessionExpiredComponent } from './shared/security/session-expired.component';
import { AuthorizationCanActivate } from './shared/security/authorization.can-activate';
import { RoutingAuthorizationCanActivate } from './shared/security/routing-authorization.can-activate';
import { AggregateReportComponent } from './aggregate-report/results/aggregate-report.component';
import { AggregateReportFormComponent } from './aggregate-report/aggregate-report-form.component';
import { AggregateReportResolve } from './aggregate-report/results/aggregate-report.resolve';
import { AggregateReportOptionsResolve } from './aggregate-report/aggregate-report-options.resolve';
import { AssessmentDefinitionResolve } from './aggregate-report/assessment/assessment-definition.resolve';
import { AggregateReportFormSettingsResolve } from './aggregate-report/aggregate-report-form-settings.resolve';
import { LongitudinalPlaygroundComponent } from './aggregate-report/results/longitudinal-playground.component';
import { GroupDashboardComponent } from './group-dashboard/group-dashboard.component';

const adminRoute = {
  path: '',
  data: {
    permissions: [ 'GROUP_WRITE', 'INSTRUCTIONAL_RESOURCE_WRITE', 'EMBARGO_WRITE' ]
  },
  canActivate: [ AuthorizationCanActivate ],
  children: [
    {
      path: 'admin-groups',
      pathMatch: 'prefix',
      data: {
        breadcrumb: {
          translate: 'admin-groups.title',
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
            breadcrumb: { translate: 'group-import.title' },
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
                breadcrumb: { translate: 'file-format.header' }
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
              data: { breadcrumb: { translate: 'import-history.title' } }
            }
          ]
        }
      ]
    },
    {
      path: 'instructional-resource',
      pathMatch: 'prefix',
      data: {
        breadcrumb: { translate: 'instructional-resource.title' },
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
        breadcrumb: { translate: 'embargo.title' },
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
      translate: 'student-results.crumb',
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
          translate: 'student-responses.crumb'
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
    resolve: {
      translateComplete: TranslateResolve
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
      },
      adminRoute,
      {
        path: 'groups/:groupId',
        data: {
          breadcrumb: { translate: 'groups.name' },
          permissions: [ 'GROUP_PII_READ' ]
        },
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
        path: 'group-dashboard/:groupId',
        data: {
          breadcrumb: { translate: 'group-dashboard.name' },
          permissions: [ 'GROUP_PII_READ' ]
        },
        canActivate: [ AuthorizationCanActivate ],
        children: [
          {
            path: '',
            pathMatch: 'full',
            data: { canReuse: true },
            component: GroupDashboardComponent
          }
        ]
      },
      {
        path: 'schools/:schoolId',
        data: {
          breadcrumb: { resolve: 'school.name' },
          permissions: [ 'INDIVIDUAL_PII_READ' ]
        },
        resolve: { school: CurrentSchoolResolve },
        canActivate: [ AuthorizationCanActivate ],
        children: [
          {
            path: '',
            pathMatch: 'full',
            data: { canReuse: true },
            resolve: {
              assessment: SchoolAssessmentResolve,
              school: CurrentSchoolResolve
            },
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
            translate: 'student-results.crumb',
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
            data: {
              breadcrumb: { translate: 'student-responses.crumb' }
            },
            component: StudentResponsesComponent
          }
        ]
      },
      {
        path: 'reports',
        pathMatch: 'full',
        data: {
          breadcrumb: { translate: 'reports.heading' },
          permissions: [ 'GROUP_PII_READ' ]
        },
        canActivate: [ AuthorizationCanActivate ],
        resolve: { reports: ReportsResolve },
        component: ReportsComponent
      },
      {
        path: 'aggregate-reports',
        data: {
          breadcrumb: { translate: 'aggregate-reports.heading' },
          permissions: [ 'CUSTOM_AGGREGATE_READ' ]
        },
        resolve: {
          options: AggregateReportOptionsResolve,
          assessmentDefinitionsByAssessmentTypeCode: AssessmentDefinitionResolve
        },
        canActivate: [ AuthorizationCanActivate ],
        children: [
          {
            path: '',
            pathMatch: 'full',
            resolve: {
              settings: AggregateReportFormSettingsResolve
            },
            component: AggregateReportFormComponent
          },
          {
            path: ':id',
            pathMatch: 'full',
            data: {
              breadcrumb: { resolve: 'report.label' }
            },
            resolve: { report: AggregateReportResolve },
            component: AggregateReportComponent
          }
        ]
      },
      {
        path: 'custom-export',
        pathMatch: 'full',
        data: {
          breadcrumb: { translate: 'organization-export.title' },
          permissions: [ 'INDIVIDUAL_PII_READ' ]
        },
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
      },
      // temporary TODO remove
      {
        path: 'longitudinal-playground',
        component: LongitudinalPlaygroundComponent
      }
    ]
  },
  {
    path: 'access-denied',
    pathMatch: 'full',
    component: AccessDeniedComponent
  }
];
