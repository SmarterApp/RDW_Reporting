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
import { SessionExpiredComponent } from "@sbac/rdw-reporting-common-ngx";
import { ReportsResolve } from "./report/reports.resolve";
import { ReportsComponent } from "./report/reports.component";
import { ErrorComponent } from "./error/error.component";
import { AccessDeniedComponent } from "./error/access-denied/access-denied.component";
import { OrganizationExportComponent } from "./organization-export/organization-export.component";
import { UserOrganizationsResolve } from "./organization-export/organization/user-organizations.resolve";
import { RoutingAuthorizationCanActivate } from "@sbac/rdw-reporting-common-ngx/security/routing-authorization.can-activate";
import { AuthorizationCanActivate } from "@sbac/rdw-reporting-common-ngx/security/authorization.can-activate";
import { AggregateReportsComponent } from "./aggregate-report/aggregate-reports.component";
import { AggregateReportsResultsComponent } from "./aggregate-report/results/aggregate-reports-results.component";


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
        data: { breadcrumb: { translate: 'labels.aggregate-reports.heading'}, permissions: [ /*TODO*/ ]},
        // canActivate: [ AuthorizationCanActivate ],
        children: [
          {
            path: '',
            data: { canReuse: true },
            pathMatch: 'full',
            component: AggregateReportsComponent
          },
          {
            path: 'results',
            pathMatch: 'full',
            data: { breadcrumb: { translate: 'labels.aggregate-reports.results.heading'}},
            component: AggregateReportsResultsComponent
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
