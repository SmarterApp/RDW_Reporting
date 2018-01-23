import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { AggregateReportForm } from "./aggregate-report-form";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { CodedEntity } from "./aggregate-report-options";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AggregateReportItem } from "./model/aggregate-report-item.model";
import { MockAggregateReportsService } from "./results/mock-aggregate-reports.service";
import { MockAggregateReportsPreviewService } from "./results/mock-aggregate-reports-preview.service";

@Component({
  selector: 'aggregate-reports',
  templateUrl: './aggregate-reports.component.html',
})
export class AggregateReportsComponent {

  form: AggregateReportForm;
  responsePreview: AggregateReportItem[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private mockAggregateReportsPreviewService: MockAggregateReportsPreviewService) {
    this.form = route.snapshot.data[ 'form' ];
  }

  get options(): AggregateReportFormOptions {
    return this.form.options;
  }

  get settings(): AggregateReportFormSettings {
    return this.form.settings;
  }

  /**
   * @returns {boolean} <code>true</code> if a non-interim assessment type is selected
   */
  get interimFieldsDisabled(): boolean {
    // TODO implement as !assessmentType.interim
    return this.settings.assessmentType.code === 'sum';
  }

  /**
   * @returns {boolean} <code>true</code> if an non-summative assessment type is selected
   */
  get summativeFieldsDisabled(): boolean {
    return !this.interimFieldsDisabled;
  }

  /**
   * TODO change performance-comparison to accept coded entity or code?
   *
   * Converts assessment type code to AssessmentType enum value
   *
   * @param {CodedEntity} assessmentType
   * @returns {AssessmentType}
   */
  toAssessmentTypeEnum(assessmentType: CodedEntity): AssessmentType {
    return [ AssessmentType.ICA, AssessmentType.IAB, AssessmentType.SUMMATIVE ][ assessmentType.id - 1 ];
  }

  /**
   * Submits the form
   */
  submit(): void {
    this.router.navigate([ 'results' ], {
      queryParams: this.toQueryParameters(this.settings),
      relativeTo: this.route
    })
  }

  /**
   * TODO
   *
   * @param {AggregateReportRequest} request
   * @returns {{assessmentType: number; subjects: any}}
   */
  private toQueryParameters(settings: AggregateReportFormSettings) {
    // TODO finish/optimize
    const idsOf = (a) => a.map(x => x.id);
    return {
      assessmentType: settings.assessmentType.id,
      subjects: idsOf(settings.subjects) // TODO optimize to not include if default?
    }
  }

  generateReport() {
    this.responsePreview = null;
    setTimeout(() => {
      this.responsePreview = null;
      this.mockAggregateReportsPreviewService.generateSampleData(this.settings.dimensionTypes, this.settings).subscribe(next => {
        this.responsePreview = next;
      })
    }, 0);
  }

}
