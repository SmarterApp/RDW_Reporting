import { Component, OnInit } from '@angular/core';
import { MeasuredAssessment } from './measured-assessment';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../groups/group';
import { GroupService } from '../groups/group.service';
import { GroupCardService } from './group-card.service';
import { ExamFilterOptionsService } from '../assessments/filters/exam-filters/exam-filter-options.service';
import { ExamFilterOptions } from '../assessments/model/exam-filter-options.model';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'group-card',
  templateUrl: './group-cards.component.html'
})
export class GroupCardsComponent implements OnInit {

  measuredAssessments: MeasuredAssessment[] = [];
  group: Group;
  groups: Group[];
  _currentGroup: Group;
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  currentSchoolYear: number;
  _currentSubject: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private groupService: GroupService,
              private groupCardService: GroupCardService,
              private filterOptionsService: ExamFilterOptionsService) {
  }

  ngOnInit() {
    const { groupId } = this.route.snapshot.params;
    forkJoin(
      this.groupService.getGroup(groupId),
      this.groupService.getGroups(),
      this.filterOptionsService.getExamFilterOptions()
    ).subscribe(([ group, groups, filterOptions ]) => {
      this.group = this.groupCardService.group = group;
      this.groups = groups;
      const { schoolYear } = this.route.snapshot.params;
      this.filterOptions = filterOptions;
      this.updateFilterOptions();
      this.currentSchoolYear = Number.parseInt(schoolYear) || filterOptions.schoolYears[ 0 ];
      this.groupCardService.schoolYear = this.currentSchoolYear;
      this.groupCardService.getAvailableMeasuredAssessments().subscribe(measuredAssessments => {
        this.measuredAssessments = measuredAssessments;
      });
    });

  }

  updateRoute(changeSource: string): void {
    this.router.navigate([ 'group-cards', this.currentGroup.id, {
      schoolYear: this.currentSchoolYear,
      subject: this.currentSubject
    } ]).then(() => {
      this.groupService.getGroup(this.currentGroup.id).subscribe((group) => {
        this.groupCardService.schoolYear = this.currentSchoolYear;
        this.group = group;
        this.groupCardService.getAvailableMeasuredAssessments().subscribe(measuredAssessments => {
          if (this.currentSubject === 'ALL') {
            this.measuredAssessments = measuredAssessments;
          } else {
            this.measuredAssessments = measuredAssessments.filter(
              measuredAssessment => measuredAssessment.assessment.subject === this._currentSubject);
          }
        });
      });

      // track change event since wiring select boxes on change as HTML attribute is not possible
      // this.angulartics2.eventTrack.next({
      //   action: 'Change' + changeSource,
      //   properties: {
      //     category: 'AssessmentResults',
      //     label: changeSource === 'Group' ? this._currentGroup.id : this._currentSchoolYear
      //   }
      // });
    });
  }

  get currentGroup(): Group {
    return this._currentGroup;
  }

  set currentGroup(value: Group) {
    this._currentGroup = value;
    if (this._currentGroup) {
      this.groupCardService.group = this._currentGroup;
    }
  }

  get currentSubject(): string {
    if (!this._currentSubject) {
      return 'ALL';
    }
    return this._currentSubject;
  }

  set currentSubject(value: string) {
    this._currentSubject = value;
    if (this._currentSubject !== 'ALL') {
      this.measuredAssessments = this.measuredAssessments.filter(
        measuredAssessment => measuredAssessment.assessment.subject === this._currentSubject);
    }
  }

  private updateFilterOptions(): void {
    this.filterOptions.subjects.push('ALL');
    this.filterOptions.subjects.sort((a, b) => a.localeCompare(b));
  }
}
