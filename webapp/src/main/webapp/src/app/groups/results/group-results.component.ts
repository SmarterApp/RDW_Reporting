import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AssessmentExam } from "../../assessments/model/assessment-exam.model";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { Assessment } from "../../assessments/model/assessment.model";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { GroupAssessmentService } from "./group-assessment.service";
import { Angulartics2 } from 'angulartics2';

@Component({
  selector: 'app-group-results',
  templateUrl: './group-results.component.html',
})
export class GroupResultsComponent implements OnInit {
  groups;
  assessmentExams: AssessmentExam[] = [];
  availableAssessments: Assessment[] = [];
  assessmentsLoading: any[] = [];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();

  get currentGroup() {
    return this._currentGroup;
  }

  set currentGroup(value) {
    this._currentGroup = value;
    this.assessmentProvider.groupId = this._currentGroup.id;
  }

  get currentSchoolYear() {
    return this._currentSchoolYear;
  }

  set currentSchoolYear(value) {
    this._currentSchoolYear = value;
    this.assessmentProvider.schoolYear = value;
  }

  get selectedAssessments() {
    return this.availableAssessments.filter(x => x.selected);
  }

  private _currentGroup;
  private _currentSchoolYear;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private filterOptionService: ExamFilterOptionsService,
              private angulartics2: Angulartics2,
              public assessmentProvider: GroupAssessmentService) {
  }

  ngOnInit() {
    this.groups = this.route.snapshot.data[ "user" ].groups;
    this.currentGroup = this.groups.find(x => x.id == this.route.snapshot.params[ "groupId" ]);

    this.filterOptionService.getExamFilterOptions().subscribe(filterOptions => {
      this.filterOptions = filterOptions;
      this.currentSchoolYear = this.mapParamsToSchoolYear(this.route.snapshot.params);
    });

    this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
  }

  updateAssessment(latestAssessment) {
    this.assessmentExams = [];

    if (latestAssessment) {
      this.assessmentExams.push(latestAssessment);
    }
  }

  updateRoute(changeSource: string) {
    this.router.navigate([ 'groups', this._currentGroup.id, { schoolYear: this._currentSchoolYear, } ]).then(() => {
      this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
    });

    // track change event since wiring select boxes on change as HTML attribute is not possible
    this.angulartics2.eventTrack.next({
      action: 'Change' + changeSource,
      properties: {
        category: 'AssessmentResults',
        label: changeSource === 'Group' ? this._currentGroup.id : this._currentSchoolYear
      }
    });
  }

  mapParamsToSchoolYear(params) {
    return Number.parseInt(params[ "schoolYear" ]) || this.filterOptions.schoolYears[ 0 ];
  }
}
