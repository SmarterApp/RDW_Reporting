import { Component, OnInit } from "@angular/core";
import { AggregateReportItem } from "../model/aggregate-report-item.model";
import { MockAggregateReportsService } from "./mock-aggregate-reports.service";
import { byNumber } from "@kourge/ordering/comparator";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { AssessmentDetailsService } from "./assessment-details.service";
import { AggregateReportQuery } from "../model/aggregate-report-query.model";
import { AssessmentDetails } from "../model/assessment-details.model";
import { Observable } from "rxjs/Observable";

/**
 * This component is responsible for performing the aggregate report query and
 * displaying the results.  Results are displayed in one table per subjectId.
 */
@Component({
  selector: 'aggregate-reports-results',
  templateUrl: './aggregate-reports-results.component.html',
})
export class AggregateReportsResultsComponent implements OnInit {

  //TODO @Input
  public query: AggregateReportQuery;

  public loading: boolean = true;
  public subjectIds: number[] = [];
  public showValuesAsPercent: boolean = true;
  public groupPerformanceLevels: boolean = false;
  public performanceGroupingCutpoint: number = -1;

  private reportDataBySubjectId: Map<number, AggregateReportItem[]> = new Map();

  constructor(private service: MockAggregateReportsService,
              private assessmentDetailsService: AssessmentDetailsService) {
    this.query = new AggregateReportQuery();
    this.query.assessmentType = AssessmentType.ICA;
  }

  ngOnInit(): void {
    const detailsObservable: Observable<AssessmentDetails> = this.assessmentDetailsService.getDetails(this.query.assessmentType);
    const dataObservable: Observable<AggregateReportItem[]> = this.service.getReportData(this.query);

    Observable.forkJoin(detailsObservable, dataObservable).subscribe((value) => {
      const details: AssessmentDetails = value[0];
      const items: AggregateReportItem[] = value[1];

      this.performanceGroupingCutpoint = details.performanceGroupingCutpoint;

      //Break out results by subject to display in separate tables
      items.forEach(item => {
        if (!this.reportDataBySubjectId.get(item.subjectId)) {
          this.reportDataBySubjectId.set(item.subjectId, []);
          this.subjectIds.push(item.subjectId);
        }
        this.reportDataBySubjectId.get(item.subjectId).push(item);
      });
      this.subjectIds.sort(byNumber);

      this.loading = false;
    });
  }
}
