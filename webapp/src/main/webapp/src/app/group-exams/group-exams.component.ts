import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {items_by_points_earned, exams_of_sessions, exams_of_group} from "../standalone/data/data";
import {sortDescOn} from "../shared/comparators";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'group-exams-component',
  templateUrl: 'group-exams.component.html'
})
export class GroupExamsComponent implements OnInit {

  private breadcrumbs = [];
  private group: any = null;
  private academicYearFilterOptions = [];
  private assessmentTypeFilterOptions = [];

  private selectedExams: Set<any> = new Set<any>();
  private selectedAssessment: any;
  private selectedAcademicYear: any;
  private selectedAssessmentType: any;
  private filteredExams: Array<any> = [];
  private count = true;

  private itemsByPointsEarned = [];
  private combinedSelectedAssessments = null;
  private selectedRecords = [];

  private selectionSummary = null;

  constructor(private service: DataService, private route: ActivatedRoute, private translate: TranslateService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.getGroupExams(params['groupId']).subscribe((data: any) => {
        let group = data.group;
        let assessment_results = data.assessment_results;

        this.group = group;

        this.academicYearFilterOptions = Array.from(assessment_results.reduce(
          (values, exam) => values.add(exam.assessmentExam.academicYear), new Set())).sort();

        this.assessmentTypeFilterOptions = Array.from(assessment_results.reduce(
          (values, exam) => values.add(exam.assessmentExam.type), new Set())).sort();

        // data prep
        this.group.exams = exams_of_group;
        this.itemsByPointsEarned = items_by_points_earned;
        this.selectedRecords = exams_of_sessions;

        this.filter();
      });
    });
  }

  onExamClick(event, exam) {
    event.stopImmediatePropagation();
    this.toggleExam(!exam.checked, exam);
  }

  toggleExam(checked: boolean, exam: any) {
    if (exam.disabled) {
      return;
    }
    exam.checked = checked;
    if (checked) {
      if (this.selectedExams.size == 0) {
        this.selectedAssessment = exam.assessmentExam;

      }
      this.selectedExams.add(exam);
    } else {
      if (this.selectedExams.size == 1) {
        this.selectedAssessment = null;

      }
      this.selectedExams.delete(exam);
    }
    this.group.exams.forEach(exam => exam.disabled = this.selectedAssessment != null && exam.assessmentExam.id !== this.selectedAssessment.id);
    this.aggregate();
  }

  onAcademicYearChange(value: string) {
    this.selectedAcademicYear = value == 'null' ? null : parseInt(value);
    this.filter();
  }

  onAssessmentTypeChange(value: string) {
    this.selectedAssessmentType = value == 'null' ? null : parseInt(value);
    this.filter();
  }

  filter() {
    this.filteredExams = this.group.exams.filter(exam => {
      return (this.selectedAcademicYear != null ? this.selectedAcademicYear == exam.assessmentExam.academicYear : true)
        && (this.selectedAssessmentType != null ? this.selectedAssessmentType == exam.assessmentExam.type : true);
    });
    this.aggregate();
  }

  aggregate() {

    // ignore selected exams that are filtered out
    let exams = Array.from(this.selectedExams)
      .filter(exam => this.filteredExams.indexOf(exam) != -1);

    if (exams.length == 0) {
      this.combinedSelectedAssessments = null;
      this.selectionSummary = null;
    } else {

      let segments = [{label:'Below', value: 0}, {label: 'Near', value: 0}, {label: 'Above', value:0}];

      exams.forEach(exam => {
        segments[0].value += exam.students.below;
        segments[1].value += exam.students.near;
        segments[2].value += exam.students.above;
      });

      segments.forEach((segment:any) => {
        segment.value = Math.floor((segment.value * 100) / exams.length);
      });

      this.combinedSelectedAssessments = {
        totalStudents: exams.reduce((value, exam) => value + exam.students.total, 0),
        averageScaleScore: Math.floor(exams.reduce((value, exam) => value + exam.students.averageScore, 0) / exams.length),
        segments: segments
      };

      // date range
      let examsSortedByDate = sortDescOn(exams.slice(), exam => exam.date);

      this.translate.get('assessmentExam.subjects.' + this.selectedAssessment.subject +'.shortName').subscribe(subjectName => {
        this.selectionSummary = {
          total: exams.reduce((total:any, exam:any) => total + exam.students.total, 0),
          start: new DatePipe(this.translate.currentLang).transform(examsSortedByDate[0].date, 'dd-MMM-yy'),
          end: examsSortedByDate.length < 2 ? null : new DatePipe(this.translate.currentLang).transform(examsSortedByDate[examsSortedByDate.length - 1].date, 'dd-MMM-yy'),
          assessmentGrade: this.selectedAssessment.grade,
          assessmentName: this.selectedAssessment.name,
          assessmentAcademicYear: this.selectedAssessment.academicYear,
          assessmentSubject: subjectName
        }
      })

    }
  }

}
