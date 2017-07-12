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

export const routes: Routes = [
  {
    path: '',
    resolve: { user: UserResolve, translateComplete: TranslateResolve },
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      {
        path: 'groups/:groupId',
        pathMatch: 'full',
        resolve: { assessment: GroupAssessmentsResolve },
        data: { breadcrumb: { translate: 'labels.groups.name'}, permissions: ['GROUP_PII_READ'] },
        component: GroupResultsComponent,
        canActivate: [ AuthorizeCanActivate ]
      },
      {
        path: 'schools/:schoolId',
        pathMatch: 'full',
        resolve: { assessment: SchoolAssessmentResolve, school: CurrentSchoolResolve },
        data: { breadcrumb: { resolve: 'school.name'}, permissions: ['INDIVIDUAL_PII_READ'] },
        component: SchoolResultsComponent,
        canActivate: [ AuthorizeCanActivate ]
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
          resolve: { assessmentItems: StudentResponsesResolve },
          data: {
            breadcrumb: {
              translate: 'labels.student.responses.crumb'
            },
            permissions: ['INDIVIDUAL_PII_READ']
          },
          component: StudentResponsesComponent
        } ]
      }
    ]
  }
];
