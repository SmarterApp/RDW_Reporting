import { Component, Input, OnInit } from "@angular/core";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";
import { Student } from "../../model/student.model";
import { MenuActionBuilder } from "../../../assessments/menu/menu-action.builder";
import { PopupMenuAction } from "@sbac/rdw-reporting-common-ngx";
import { InstructionalResourcesService } from "../../../assessments/results/instructional-resources.service";
import {
  InstructionalResource,
  InstructionalResources
} from "../../../assessments/model/instructional-resources.model";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'student-history-ica-summitive-table',
  providers: [ MenuActionBuilder ],
  templateUrl: 'student-history-ica-summitive-table.component.html'
})
export class StudentHistoryICASummitiveTableComponent implements OnInit {

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

  @Input()
  displayState: any = {
    table: 'overall' // ['overall' | 'claim']
  };

  actions: PopupMenuAction[];
  instructionalResources: InstructionalResource[];

  constructor(private actionBuilder: MenuActionBuilder,
              private instructionalResourcesService: InstructionalResourcesService) {
  }

  ngOnInit(): void {
    this.actions = this.createActions();
  }

  /**
   * Sample the "first" assessment for the available claimCode codes,
   * with an understanding that all assessments within a subject
   * contain the same claims in the same order.
   *
   * @returns {string[]} The claimCode codes for this table.
   */
  public getClaims(): string[] {
    if (this.exams.length === 0) return [];

    return this.exams[ 0 ].assessment.claimCodes;
  }

  loadInstructionalResources(studentHistoryExam: StudentHistoryExamWrapper) {
    let exam = studentHistoryExam.exam;
    this.instructionalResourcesService.getInstructionalResources(studentHistoryExam.assessment.id, exam.school.id).subscribe((instructionalResources: InstructionalResources) => {
      this.instructionalResources = instructionalResources.getResourcesByPerformance(exam.level);
    });
  }

  loadAssessmentInstructionalResources(studentHistoryExam: StudentHistoryExamWrapper): Observable<InstructionalResource[]> {
    let exam = studentHistoryExam.exam;
    return this.instructionalResourcesService.getInstructionalResources(studentHistoryExam.assessment.id, exam.school.id)
      .map((resources: InstructionalResources) => {
        return resources.getResourcesByPerformance(0);
      });
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
}
