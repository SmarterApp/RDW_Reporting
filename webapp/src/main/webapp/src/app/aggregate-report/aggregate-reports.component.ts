import { Component, ViewChild } from "@angular/core";
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
import { District, Organization, OrganizationType, School } from "../shared/organization/organization";
import { Observable } from "rxjs/Observable";
import { OrganizationTypeahead } from "../shared/organization/organization-typeahead";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";

/**
 * Form control validator that makes sure the control value is not an empty array
 *
 * @param properties the properties to propagate when the control value is invalid
 * @return any|null
 */
const notEmpty = properties => control => {
  return control.value.length ? null : { notEmpty: properties };
};

const OrganizationComparator = (a: Organization, b: Organization) => a.name.localeCompare(b.name);


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

  /**
   * The tabular data for the response preview
   */
  responsePreview: AggregateReportItem[] = [];

  /**
   * Responsible for tracking form validity
   */
  formGroup: FormGroup;

  /**
   * The organization typeahead
   */
  @ViewChild('organizationTypeahead')
  organizationTypeahead: OrganizationTypeahead;

  /**
   * The organization typeahead options
   */
  organizationTypeaheadOptions: Observable<Organization[]>;

  /**
   * The selected organizations
   */
  organizations: Organization[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private organizationService: AggregateReportOrganizationService,
              private mockAggregateReportsPreviewService: MockAggregateReportsPreviewService) {

    this.form = route.snapshot.data[ 'form' ];

    this.formGroup = new FormGroup({
      organizations: new FormControl(this.organizations, notEmpty({
        messageId: 'labels.aggregate-reports.form.field.organization.error-empty'
      })),
      assessmentGrades: new FormControl(this.form.settings.assessmentGrades, notEmpty({
        messageId: 'labels.aggregate-reports.form.field.assessment-grades.error-empty'
      })),
      schoolYears: new FormControl(this.form.settings.schoolYears, notEmpty({
        messageId: 'labels.aggregate-reports.form.field.school-year.error-empty'
      }))
    });

    this.organizationTypeaheadOptions = Observable.create(observer => {
      observer.next(this.organizationTypeahead.value);
    }).mergeMap(search => this.organizationService.getOrganizationsMatchingName(search)
      .map(organizations => organizations.filter(
        organization => this.organizations.findIndex(x => organization.equals(x)) === -1
      ))
    );
  }

  get options(): AggregateReportFormOptions {
    return this.form.options;
  }

  get settings(): AggregateReportFormSettings {
    return this.form.settings;
  }

  /**
   * @returns {any} The organizations form control
   */
  get organizationsControl(): FormControl {
    return <FormControl>this.formGroup.get('organizations');
  }

  /**
   * @returns {any} The assessment grades form control
   */
  get assessmentGradesControl(): FormControl {
    return <FormControl>this.formGroup.get('assessmentGrades');
  }

  /**
   * @returns {any} The school years form control
   */
  get schoolYearsControl(): FormControl {
    return <FormControl>this.formGroup.get('schoolYears');
  }

  /**
   * @returns {boolean} true if the control has errors and has been touched or dirtied
   */
  showErrors(formControl: FormControl): boolean {
    return Forms.showErrors(formControl);
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
   * Organization typeahead select handler
   *
   * @param organization the selected organization
   */
  onTypeaheadSelect(organization: any): void {
    this.organizationTypeahead.value = '';
    this.addOrganization(organization);
  }

  /**
   * Adds an organization to the selected organizations
   *
   * @param {Organization} organization
   */
  private addOrganization(organization: Organization): void {
    const finder = value => value.equals(organization);
    const index = this.organizations.findIndex(finder);
    if (index === -1) {
      // new array needed for change detection to kick in
      this.organizations = this.organizations.concat(organization);
      if (organization.type === OrganizationType.District) {
        this.settings.districts.push(<District>organization);
        this.settings.districts.sort(OrganizationComparator);
      } else if (organization.type === OrganizationType.School) {
        this.settings.schools.push(<School>organization);
        this.settings.schools.sort(OrganizationComparator);
      }
    }
  }

  /**
   * Removes an organization from the selected organizations
   *
   * @param {Organization} organization the organization to remove
   */
  private removeOrganization(organization: Organization): void {
    const finder = value => value.equals(organization);
    const index = this.organizations.findIndex(finder);
    if (index !== -1) {
      this.organizations = this.organizations.filter(value => !organization.equals(value));
      if (organization.type === OrganizationType.District) {
        this.settings.districts.splice(this.settings.districts.findIndex(finder), 1);
      } else if (organization.type === OrganizationType.School) {
        this.settings.schools.splice(this.settings.schools.findIndex(finder), 1);
      }
    }
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
