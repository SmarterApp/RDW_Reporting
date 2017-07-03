import { Component, Input } from "@angular/core";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";

@Component({
  selector: 'student-history-iab-table',
  templateUrl: 'student-history-iab-table.component.html'
})
export class StudentHistoryIABTableComponent {

  @Input()
  exams: StudentHistoryExamWrapper[] = [];

}
