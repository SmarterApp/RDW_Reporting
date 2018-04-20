import { Component, Input, OnInit } from '@angular/core';
import { MeasuredAssessment } from './measured-assessment';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../groups/group';
import { GroupService } from '../groups/group.service';
import { GroupDashboardService } from './group-dashboard.service';
import { ExamFilterOptionsService } from '../assessments/filters/exam-filters/exam-filter-options.service';
import { ExamFilterOptions } from '../assessments/model/exam-filter-options.model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AssessmentCardEvent } from './assessment-card.component';

@Component({
  selector: 'group-dashboard',
  templateUrl: './group-dashboard.component.html'
})
export class GroupDashboardComponent implements OnInit {

  measuredAssessments: MeasuredAssessment[] = [];
  group: Group;
  groups: Group[];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  currentSchoolYear: number;
  currentGroup: Group;
  private _currentSubject: string;
  private selectedAssessments: number[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private groupService: GroupService,
              private groupDashboardService: GroupDashboardService,
              private filterOptionsService: ExamFilterOptionsService) {
  }

  ngOnInit() {
    const { groupId } = this.route.snapshot.params;
    forkJoin(
      this.groupService.getGroup(groupId),
      this.groupService.getGroups(),
      this.filterOptionsService.getExamFilterOptions()
    ).subscribe(([ group, groups, filterOptions ]) => {
      this.group = this.currentGroup = group;
      this.groups = groups;
      const { schoolYear } = this.route.snapshot.params;
      this.filterOptions = filterOptions;
      this.updateFilterOptions();
      this.currentSchoolYear = Number.parseInt(schoolYear) || filterOptions.schoolYears[ 0 ];
      this.groupDashboardService.getAvailableMeasuredAssessments(group, this.currentSchoolYear).subscribe(measuredAssessments => {
        this.measuredAssessments = measuredAssessments;
      });
    });

  }

  compareGroups(g1: Group, g2: Group): boolean {
    return g1 && g2 ? g1.id === g2.id : g1 === g2;
  }

  get cardViewEnabled() {
    return this.selectedAssessments.length !== 0;
  }

  updateRoute(changeSource: string): void {
    this.selectedAssessments = [];
    this.router.navigate([ 'group-dashboard', this.currentGroup.id, {
      schoolYear: this.currentSchoolYear,
      subject: this.currentSubject
    } ]).then(() => {
      this.groupService.getGroup(this.currentGroup.id).subscribe((group) => {
        this.group = group;
        this.groupDashboardService.getAvailableMeasuredAssessments(group, this.currentSchoolYear).subscribe(measuredAssessments => {
          if (this.currentSubject === 'ALL') {
            this.measuredAssessments = measuredAssessments;
          } else {
            this.measuredAssessments = measuredAssessments.filter(
              measuredAssessment => measuredAssessment.assessment.subject === this._currentSubject);
          }
        });
      });
      // TODO analytics
    });
  }

  get currentSubject(): string {
    if (!this._currentSubject) {
      return 'ALL';
    }
    return this._currentSubject;
  }

  @Input()
  set currentSubject(value: string) {
    this._currentSubject = value;
    if (!this._currentSubject) {
      this.measuredAssessments = this.measuredAssessments.filter(
        measuredAssessment => measuredAssessment.assessment.subject === this._currentSubject);
    }
  }

  private updateFilterOptions(): void {
    this.filterOptions.subjects.unshift('ALL');
  }

  onCardSelection(event: AssessmentCardEvent) {
    if (event.selected) {
      this.selectedAssessments.push(event.measuredAssessment.assessment.id);
    } else {
      this.selectedAssessments = this.selectedAssessments.filter(id => id !== event.measuredAssessment.assessment.id);
    }
  }

}
