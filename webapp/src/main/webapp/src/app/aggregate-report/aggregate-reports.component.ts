import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { AggregateReportForm } from "./aggregate-report-form";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { CodedEntity } from "./aggregate-report-options";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { NotificationService } from "../shared/notification/notification.service";
import { FormControl, FormGroup } from "@angular/forms";
import { Forms } from "../shared/form/forms";
import { AggregateReportItem } from "./model/aggregate-report-item.model";
import { MockAggregateReportsPreviewService } from "./results/mock-aggregate-reports-preview.service";

/**
 * Form control validator that makes sure the control value is not an empty array
 *
 * @param properties the properties to propagate when the control value is invalid
 * @return any|null
 */
const notEmpty = properties => control => {
  return control.value.length ? null : { notEmpty: properties };
};

/**
 * Aggregate report form component
 */
@Component({
  selector: 'aggregate-reports',
  templateUrl: './aggregate-reports.component.html',
})
export class AggregateReportsComponent {

  /**
   * Holds the form options and state
   */
  form: AggregateReportForm;
  responsePreview: AggregateReportItem[] = [];

  /**
   * Responsible for tracking form validity
   */
  formGroup: FormGroup;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private mockAggregateReportsPreviewService: MockAggregateReportsPreviewService) {
    this.form = route.snapshot.data[ 'form' ];
    this.formGroup = new FormGroup({
      assessmentGrades: new FormControl(this.form.settings.assessmentGrades, notEmpty({
        messageId: 'labels.aggregate-reports.form.field.assessment-grades.error-empty'
      }))
    });
  }

  get options(): AggregateReportFormOptions {
    return this.form.options;
  }

  get settings(): AggregateReportFormSettings {
    return this.form.settings;
  }

  /**
   * @returns {any} The assessment grades form control
   */
  get assessmentGradesControl(): FormControl {
    return <FormControl>this.formGroup.get('assessmentGrades');
  }

  /**
   * @returns {boolean} true if the assessment grade control has errors and has been touched or the form submitted
   */
  get showAssessmentGradeErrors(): boolean {
    return this.assessmentGradesControl.invalid
      && (this.assessmentGradesControl.dirty || this.assessmentGradesControl.touched);
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
    this.validate(this.formGroup, () => {
      this.router.navigate([ 'results' ], {
        queryParams: this.toQueryParameters(this.settings),
        relativeTo: this.route
      })
    });
  }

  /**
   * Exports the data specified by the form
   */
  export(): void {
    this.validate(this.formGroup, () => null /* TODO */);
  }

  /**
   * Validates the given form group and marks the controls as dirty.
   * If the form is valid the onValid callback will be called
   * If the form is invalid the notifications will be displayed to the user
   *
   * @param {FormGroup} formGroup
   * @param {Function} onValid
   */
  private validate(formGroup: FormGroup, onValid: () => void): void {

    // Mark form as dirty
    Forms.controls(this.formGroup)
      .forEach(control => control.markAsDirty());

    if (formGroup.valid) {
      // Execute callback if the form is valid
      onValid();
    } else {
      // Notify user of all form errors to correct
      Forms.errors(this.formGroup).forEach(error => {
        this.notificationService.error({ id: error.properties.messageId });
      });
    }
  }

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
