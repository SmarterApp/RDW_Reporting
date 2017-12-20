import { Component, Input, OnInit } from "@angular/core";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";
import { Student } from "../../model/student.model";
import { MenuActionBuilder } from "../../../assessments/menu/menu-action.builder";
import { InstructionalResourcesService } from "../../../assessments/results/instructional-resources.service";
import {
  InstructionalResource,
  InstructionalResources
} from "../../../assessments/model/instructional-resources.model";
import { PopupMenuAction } from "@sbac/rdw-reporting-common-ngx/menu/popup-menu-action.model";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'student-history-iab-table',
  providers: [ MenuActionBuilder ],
  templateUrl: 'student-history-iab-table.component.html'
})
export class StudentHistoryIABTableComponent implements OnInit {

  @Input()
  exams: StudentHistoryExamWrapper[] = [];

  @Input()
  student: Student;

  /**
   * Represents the cutoff year for when there is no item level response data available.
   * If there are no exams that are after this school year, then disable the ability to go there and show proper message
   */
  @Input()
  minimumItemDataYear: number;


  actions: PopupMenuAction[];
  instructionalResourcesProvider: () => Observable<InstructionalResource[]>;

  constructor(private actionBuilder: MenuActionBuilder,
              private instructionalResourcesService: InstructionalResourcesService) {
  }

  ngOnInit(): void {
    this.actions = this.createActions();
  }

  /**
   * Create table row menu actions.
   *
   * @returns {PopupMenuAction[]} The table row menu actions
   */
  private createActions(): PopupMenuAction[] {
    return this.actionBuilder
      .newActions()
      .withResponses(x => x.exam.id, () => this.student, x => x.exam.schoolYear > this.minimumItemDataYear)
      .withShowResources(this.loadAssessmentInstructionalResources.bind(this))
      .build();
  }

  loadInstructionalResources(studentHistoryExam: StudentHistoryExamWrapper): void {
    let exam = studentHistoryExam.exam;
    this.instructionalResourcesProvider = () => this.instructionalResourcesService.getInstructionalResources(studentHistoryExam.assessment.id, exam.school.id)
      .map(resources => resources.getResourcesByPerformance(exam.level));
  }

  loadAssessmentInstructionalResources(studentHistoryExam: StudentHistoryExamWrapper): Observable<InstructionalResource[]> {
    let exam = studentHistoryExam.exam;
    return this.instructionalResourcesService.getInstructionalResources(studentHistoryExam.assessment.id, exam.school.id)
      .map((resources: InstructionalResources) => {
        return resources.getResourcesByPerformance(0);
      });
  }
}
