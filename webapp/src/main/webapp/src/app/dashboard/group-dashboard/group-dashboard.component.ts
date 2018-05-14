import { Component, Input, OnInit } from '@angular/core';
import { MeasuredAssessment } from '../measured-assessment';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../groups/group';
import { GroupService } from '../../groups/group.service';
import { GroupDashboardService } from './group-dashboard.service';
import { ExamFilterOptionsService } from '../../assessments/filters/exam-filters/exam-filter-options.service';
import { ExamFilterOptions } from '../../assessments/model/exam-filter-options.model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AssessmentCardEvent } from './group-assessment-card.component';
import { GroupReportDownloadComponent } from '../../report/group-report-download.component';
import { byString } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';

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
  private selectedAssessments: MeasuredAssessment[] = [];
  private _availableSubjects: Set<string> = new Set<string>();

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
      this.currentSchoolYear = Number.parseInt(schoolYear) || filterOptions.schoolYears[ 0 ];
      this.groupDashboardService.getAvailableMeasuredAssessments(group, this.currentSchoolYear).subscribe(measuredAssessments => {
        this.measuredAssessments = measuredAssessments.sort(ordering(byString).on<MeasuredAssessment>(x => x.assessment.label).compare);
        this.setAvailableSubjects(measuredAssessments);
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
      schoolYear: this.currentSchoolYear
    } ]).then(() => {
      this.groupService.getGroup(this.currentGroup.id).subscribe((group) => {
        this.group = group;
        this.groupDashboardService.getAvailableMeasuredAssessments(group, this.currentSchoolYear).subscribe(measuredAssessments => {
          this.setAvailableSubjects(measuredAssessments);
          if (!this.currentSubject) {
            this.measuredAssessments = measuredAssessments;
          } else {
            this.measuredAssessments = measuredAssessments.filter(
              measuredAssessment => measuredAssessment.assessment.subject === this._currentSubject);
          }
        });
      });
    });
  }

  setAvailableSubjects(measuredAssessments: MeasuredAssessment[]): void {
    this._availableSubjects = new Set(measuredAssessments.map(x => x.assessment.subject));
  }

  viewAssessments(): void {
    const queryParams = {  };
    this.router.navigate([ 'groups', this.currentGroup.id, {
      schoolYear: this.currentSchoolYear,
      assessmentIds: this.selectedAssessments.map(measuredAssessment => measuredAssessment.assessment.id)
    } ]).then(() => {
      // reset selected assessments to avoid issues with going back to previous page
      this.selectedAssessments = [];
      this.groupService.getGroup(this.currentGroup.id).subscribe((group) => {
        this.group = group;
        this.groupDashboardService.getAvailableMeasuredAssessments(group, this.currentSchoolYear).subscribe(measuredAssessments => {
          if (!this.currentSubject) {
            this.measuredAssessments = measuredAssessments;
          } else {
            this.measuredAssessments = measuredAssessments.filter(
              measuredAssessment => measuredAssessment.assessment.subject === this._currentSubject);
          }
        });
      });
    });
  }

  get currentSubject(): string {
    return this._currentSubject;
  }

  @Input()
  set currentSubject(value: string) {
    this._currentSubject = value;
    this.measuredAssessments = this.measuredAssessments.filter(
      measuredAssessment => measuredAssessment.assessment.subject === this._currentSubject);
  }

  onCardSelection(event: AssessmentCardEvent) {
    this.selectedAssessments = event.selected ? this.selectedAssessments.concat(event.measuredAssessment)
      : this.selectedAssessments.filter(measuredAssessment =>
        measuredAssessment.assessment.id !== event.measuredAssessment.assessment.id);
  }

  hasSubject(subject: string): boolean {
    return this._availableSubjects.has(subject);
  }

  /**
   * Initializes GroupReportDownloadComponent options with the currently selected filters
   *
   * @param downloader
   */
  initializeDownloader(downloader: GroupReportDownloadComponent): void {
    downloader.options.schoolYear = this.currentSchoolYear;
  }

}
