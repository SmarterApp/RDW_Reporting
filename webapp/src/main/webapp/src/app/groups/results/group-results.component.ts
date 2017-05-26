import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CachingDataService } from "../../shared/cachingData.service";
import { AssessmentExam } from "./assessment/model/assessment-exam.model";

@Component({
  selector: 'app-group-results',
  templateUrl: './group-results.component.html',
})
export class GroupResultsComponent implements OnInit {
  private _groups;
  private _availableSchoolYears;
  private _currentGroup;
  private _showValuesAsPercent : boolean = true;

  get showValuesAsPercent(): boolean {
    return this._showValuesAsPercent;
  }

  set showValuesAsPercent(value: boolean) {
    this._showValuesAsPercent = value;
  }

  private _filterBy = { schoolYear: 0 };


  get groups() {
    return this._groups;
  }

  get availableSchoolYears() {
    return this._availableSchoolYears;
  }

  get currentGroup() {
    return this._currentGroup;
  }

  set currentGroup(value) {
    this._currentGroup = value;
  }

  get filterBy(): { schoolYear: number } {
    return this._filterBy;
  }

  set filterBy(value: { schoolYear: number }) {
    this._filterBy = value;
  }

  get selectedAssessments(): AssessmentExam[] {
    return this._selectedAssessments;
  }

  private _selectedAssessments : AssessmentExam[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private staticDataService: CachingDataService) {
  }

  ngOnInit() {
    this._groups = this.route.snapshot.data[ "groups" ];
    this._currentGroup = this._groups.find(x => x.id == this.route.snapshot.params[ "groupId" ]);

    this.updateAssessment(this.route.snapshot.data[ "assessment" ]);

    this.staticDataService.getSchoolYears().subscribe(years => {
      this._availableSchoolYears = years;
      this._filterBy = this.mapParamsToFilterBy(this.route.snapshot.params);
    });
  }

  updateAssessment(latestAssessment) {
    this._selectedAssessments = [];

    if (latestAssessment)
      this._selectedAssessments.push(latestAssessment);
  }

  updateRoute(event) {
    this.router.navigate([ 'groups', this._currentGroup.id, { schoolYear: this._filterBy.schoolYear } ]).then(() => {
      this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
    });
  }

  mapParamsToFilterBy(params) {
    return {
      schoolYear: Number.parseInt(params[ "schoolYear" ]) || this._availableSchoolYears[ 0 ]
    }
  }
}
