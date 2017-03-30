import {HomeComponent} from "../home/home.component";
import {GroupsComponent} from "../groups/groups.component";
import {GroupStudentsComponent} from "../group-students/group-students.component";
import {StudentExamsComponent} from "../student-exams/student-exams.component";
import {GroupExamsComponent} from "../group-exams/group-exams.component";
import {StudentExamItemsComponent} from "../student-exam-items/student-exam-items.component";
import {GroupExamItemComponent} from "../group-exam-item/group-exam-item.component";
import {StudentExamReportComponent} from "../student-exam-report/student-exam-report.component";
import {AdminSearchComponent} from "../admin-search/admin-search.component";

export const routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'search',
    component: AdminSearchComponent
  },
  {
    path: 'groups',
    component: GroupsComponent
  },
  {
    path: 'groups/:groupId/students',
    component: GroupStudentsComponent
  },
  {
    path: 'groups/:groupId/exams',
    component: GroupExamsComponent
  },
  {
    path: 'groups/:groupId/exams/:examId/items/:itemId',
    component: GroupExamItemComponent
  },
  {
    path: 'groups/:groupId/exams/:examId/items/:itemId/score/:score',
    component: GroupExamItemComponent
  },
  {
    path: 'groups/:groupId/students/:studentId/exams',
    component: StudentExamsComponent
  },
  {
    path: 'groups/:groupId/students/:studentId/exams/:examId/items',
    component: StudentExamItemsComponent
  },
  {
    path: 'groups/:groupId/students/:studentId/exams/:examId/report',
    component: StudentExamReportComponent
  }
];
