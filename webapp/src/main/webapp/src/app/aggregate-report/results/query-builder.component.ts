import { Component, OnInit } from "@angular/core";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect'
import { ReportOptionsService } from "./report-options.service";
import { QueryBuilderModel } from "../model/query-builder.model";
import { MockAggregateReportsService } from "./mock-aggregate-reports.service";
import { AggregateReportQuery } from "../model/aggregate-report-query.model";
import { SchoolYearPipe } from "../../shared/format/school-year.pipe";
import { AggregateReportItem } from "../model/aggregate-report-item.model";

@Component({
  selector: 'query-builder',
  templateUrl: './query-builder.component.html',
})
export class QueryBuilderComponent implements OnInit {

  readonly ICA: AssessmentType = AssessmentType.ICA;

  aggregateReportQuery: AggregateReportQuery = new AggregateReportQuery();

  queryBuilderModel: QueryBuilderModel = new QueryBuilderModel();

  responsePreview: AggregateReportItem[] = [];

  multiSelectOptions: IMultiSelectOption[];
  optionsModel: string[];
  texts: IMultiSelectTexts;
  settings: IMultiSelectSettings = {
    fixedTitle: true,
    maxHeight: null
  };


  get translateRoot() {
    return "labels.filters.";
  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private reportOptionsService: ReportOptionsService,
              private mockAggregateReportsService: MockAggregateReportsService,
              private schoolYearPipe: SchoolYearPipe) {
    this.aggregateReportQuery.assessmentType = AssessmentType.ICA;
  }

  ngOnInit() {
    this.reportOptionsService.get().subscribe((queryBuilderModel: QueryBuilderModel) => {
      this.queryBuilderModel = queryBuilderModel;
      this.aggregateReportQuery.schoolYears [ this.schoolYearPipe.transform(queryBuilderModel.schoolYears[ 0 ]) ] = true;
      this.aggregateReportQuery.completeness = 'Complete';
      this.aggregateReportQuery.administration = 'SD';
      this.aggregateReportQuery.summativeStatus = 'Valid';
    });


    this.multiSelectOptions = [
      { id: 'Gender', name: this.translate.instant('labels.filters.student.gender') },
      { id: 'Ethnicity', name: this.translate.instant('labels.filters.student.ethnicity') },
      {
        id: 'LimitedEnglishProficiency',
        name: this.translate.instant('labels.filters.student.limited-english-proficiency')
      },
      { id: 'MigrantStatus', name: this.translate.instant('labels.filters.student.migrant-status') },
      { id: 'EconomicDisadvantage', name: this.translate.instant('labels.filters.student.economic-disadvantage') },
      { id: 'IEP', name: this.translate.instant('labels.filters.student.iep') },
      { id: '504Plan', name: this.translate.instant('labels.filters.student.504-plan') },

    ];
    this.texts = {
      defaultTitle: this.translate.instant('labels.aggregate-reports.query-builder.filter-results.organize-result-set-well.comparative-subgroups.title')
    };
  }

  getMultiSelectOption(key: string): IMultiSelectOption {
    let option: IMultiSelectOption;
    this.multiSelectOptions.find(name => {
      if (name.id === key) {
        option = name;
        return true;
      }
    });
    return option;
  }

  scrollTo(id: string) {
    setTimeout(() => {
      document.getElementById(id).scrollIntoView();
    }, 0);
  }

  generateReport() {
    this.responsePreview = null;
    setTimeout(() => {
      this.responsePreview = null;
      this.mockAggregateReportsService.generateQueryBuilderSampleData(this.optionsModel, this.aggregateReportQuery, this.queryBuilderModel).subscribe(next => {
        this.responsePreview = next;
      })
    }, 0);
  }
}
