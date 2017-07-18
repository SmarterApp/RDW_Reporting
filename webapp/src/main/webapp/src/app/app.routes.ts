import { HomeComponent } from "./home/home.component";
import { Routes } from "@angular/router";
import { GroupResultsComponent } from "./groups/results/group-results.component";
import { GroupAssessmentsResolve } from "./groups/results/group-assessments.resolve";
import { AuthorizeCanActivate } from "./user/authorize.can-activate";
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
import { SessionExpiredComponent } from "./shared/authentication/session-expired.component";


const studentTestHistoryChildRoute = {
  path: 'students/:studentId',
  resolve: { examHistory: StudentExamHistoryResolve },
  data: {
    breadcrumb: {
      translate: 'labels.student.results.crumb',
      translateResolve: 'examHistory.student'
    },
  },
  children: [ {
    path: '',
    pathMatch: 'full',
    component: StudentResultsComponent
  }, {
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
  } ]
};

export const routes: Routes = [
  {
    path: '',
    resolve: { user: UserResolve, translateComplete: TranslateResolve },
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      {
        path: 'groups/:groupId',
        data: { breadcrumb: { translate: 'labels.groups.name'}, permissions: ['GROUP_PII_READ'] },
        canActivate: [ AuthorizeCanActivate ],
        children: [ {
          path: '',
          pathMatch: 'full',
          resolve: { assessment: GroupAssessmentsResolve },
          component: GroupResultsComponent
        },
        studentTestHistoryChildRoute
        ]
      },
      {
        path: 'schools/:schoolId',
        data: { breadcrumb: { resolve: 'school.name'}, permissions: ['INDIVIDUAL_PII_READ'] },
        resolve: { school: CurrentSchoolResolve },
        canActivate: [ AuthorizeCanActivate ],
        children: [ {
          path: '',
          pathMatch: 'full',
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
          permissions: ['INDIVIDUAL_PII_READ']
        },
        canActivate: [ AuthorizeCanActivate ],
        children: [ {
          path: '',
          pathMatch: 'full',
          component: StudentResultsComponent
        }, {
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
        } ]
      },
      {
        path: 'session-expired',
        pathMatch: 'full',
        component: SessionExpiredComponent
      }
    ]
  }
];
