import { HomeComponent } from "../home/home.component";
import { GroupStudentsComponent } from "../group-students/group-students.component";
import { StudentExamsComponent } from "../student-exams/student-exams.component";
import { GroupExamsComponent } from "../group-exams/group-exams.component";
import { StudentExamItemsComponent } from "../student-exam-items/student-exam-items.component";
import { GroupExamItemComponent } from "../group-exam-item/group-exam-item.component";
import { StudentExamReportComponent } from "../student-exam-report/student-exam-report.component";
import { AdminSearchComponent } from "../admin-search/admin-search.component";
import { Routes } from "@angular/router";
import { GroupResolve } from "../groups/group.resolve";
import { StudentExamsResolve } from "../student-exams/student-exam.resolve";
import { StudentExamItemsResolve } from "../student-exam-items/student-exam-items.resolve";
import { GroupExamItemResolve } from "../group-exam-item/group-exam-item.resolve";
import { GroupResultsComponent } from "../groups/results/group-results.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'search',
    data: { breadcrumb: { translate: 'labels.search.title' } },
    children: [
      { path: '', pathMatch: 'full', component: AdminSearchComponent },
      {
        path: 'students/:studentId/exams',
        data: { breadcrumb: { resolve: 'studentData.student.fullName' } },
        resolve: { studentData: StudentExamsResolve },
        component: StudentExamsComponent
      }
    ]
  }, {
    path: 'groups/:groupId',
    data: { breadcrumb: { translate: 'labels.groups.name'} },
    component: GroupResultsComponent
  }, {
    path: 'groups/:groupId/students',
    data: { breadcrumb: { resolve: 'groupData.group.name' } },
    resolve: { groupData: GroupResolve },
    children: [
      { path: '', pathMatch: 'full', component: GroupStudentsComponent },
      {
        path: ':studentId/exams',
        data: { breadcrumb: { resolve: 'studentData.student.fullName' } },
        resolve: { studentData: StudentExamsResolve },
        children: [
          { path: '', pathMatch: 'full', component: StudentExamsComponent },
          {
            path: ':examId/items',
            component: StudentExamItemsComponent,
            data: { breadcrumb: { resolve: 'examData.exam.assessment.fullName' } },
            resolve: { examData: StudentExamItemsResolve }
          },
          {
            path: ':examId/report',
            component: StudentExamReportComponent,
            data: { breadcrumb: { translate: 'Report' } }
          }
        ]
      }
    ]
  }, {
    path: 'groups/:groupId/exams',
    data: { breadcrumb: { resolve: 'groupData.group.name' } },
    resolve: { groupData: GroupResolve },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: GroupExamsComponent
      },
      {
        path: ':examId/items/:itemId',
        component: GroupExamItemComponent,
        data: { breadcrumb: { resolve: 'examData.item.title' } },
        resolve: { examData: GroupExamItemResolve }
      },
      {
        path: ':examId/items/:itemId/score/:scoreId',
        component: GroupExamItemComponent,
        data: { breadcrumb: { resolve: 'examData.item.title' } },
        resolve: { examData: GroupExamItemResolve }
      }
    ]
  }
];
