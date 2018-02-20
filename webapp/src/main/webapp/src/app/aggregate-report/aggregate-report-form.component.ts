import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { NotificationService } from "../shared/notification/notification.service";
import { FormControl, FormGroup } from "@angular/forms";
import { Forms } from "../shared/form/forms";
import { District, Organization, OrganizationType, School } from "../shared/organization/organization";
import { Observable } from "rxjs/Observable";
import { OrganizationTypeahead } from "../shared/organization/organization-typeahead";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import { AggregateReportService } from "./aggregate-report.service";
import { AggregateReportTable } from "./results/aggregate-report-table.component";
import { AggregateReportRequest } from "../report/aggregate-report-request";
import { AggregateReportOptionsMapper } from "./aggregate-report-options.mapper";
import { AggregateReportTableDataService } from "./aggregate-report-table-data.service";
import { AssessmentDefinition } from "./assessment/assessment-definition";
import { AggregateReportOptions } from "./aggregate-report-options";
import { AggregateReportRequestMapper } from "./aggregate-report-request.mapper";
import { AggregateReportColumnOrderItemProvider } from "./aggregate-report-column-order-item.provider";
import { OrderableItem } from "../shared/order-selector/order-selector.component";
import { AggregateReportRequestSummary, AggregateReportSummary } from "./aggregate-report-summary.component";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/switchMap";

/**
 * Form control validator that makes sure the control value is not an empty array
 *
 * @param properties the properties to propagate when the control value is invalid
 * @return {null|{notEmpty: any}}}
 */
const notEmpty = properties => control => {
  return control.value.length ? null : { notEmpty: properties };
};

/**
 * Form control validator that makes sure the control value is a valid filename
 *
 * @param properties the properties to propagate when the control value is invalid
 * @return {null|{fileName: any}}}
 */
const fileName = (properties: any) => control => {
  return /^[^\\<>:;,?"*|/]*$/.test((control.value || '').trim()) ? null : { fileName: properties };
};

/**
 * Form control validator that makes sure the organization control is not empty
 * or includeStateResults or inlcudeAllDistricts is flagged
 *
 * @param properties the properties to propagate when the control value is invalid
 * @return {null|{notEmpty: any}}}
 */
const organizationValidator = (properties, settings) => control => {
  return settings.includeStateResults
  || settings.includeAllDistricts
  || control.value.length ? null : { invalid: properties };
};

const OrganizationComparator = (a: Organization, b: Organization) => a.name.localeCompare(b.name);

/**
 * Aggregate report form component
 */
@Component({
  selector: 'aggregate-report-form',
  templateUrl: './aggregate-report-form.component.html',
})
export class AggregateReportFormComponent {

  /**
   * Holds the form options
   */
  options: AggregateReportFormOptions;

  /**
   * Holds the form state
   */
  settings: AggregateReportFormSettings;

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

  /**
   * The preview table data
   */
  previewTable: AggregateReportTable;

  /**
   * Holds the server report options
   */
  aggregateReportOptions: AggregateReportOptions;

  /**
   * Assessment definitions for use in generating sample data
   */
  assessmentDefinitionsByTypeCode: Map<string, AssessmentDefinition>;

  summary: AggregateReportRequestSummary;

  /**
   * The current column order
   */
  columnItems: OrderableItem[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private optionMapper: AggregateReportOptionsMapper,
              private requestMapper: AggregateReportRequestMapper,
              private notificationService: NotificationService,
              private organizationService: AggregateReportOrganizationService,
              private reportService: AggregateReportService,
              private tableDataService: AggregateReportTableDataService,
              private columnOrderableItemProvider: AggregateReportColumnOrderItemProvider) {

    this.assessmentDefinitionsByTypeCode = route.snapshot.data[ 'assessmentDefinitionsByAssessmentTypeCode' ];
    this.aggregateReportOptions = route.snapshot.data[ 'options' ];
    this.settings = route.snapshot.data[ 'settings' ];

    this.organizations = this.organizations.concat(this.settings.districts, this.settings.schools);

    const defaultOrganization = this.aggregateReportOptions.defaultOrganization;
    if (this.organizations.length == 0 && defaultOrganization) {
      this.addOrganizationToSettings(defaultOrganization);
    }

    this.columnItems = this.columnOrderableItemProvider.toOrderableItems(this.settings.columnOrder);

    this.summary = {
      assessmentDefinition: this.currentAssessmentDefinition,
      options: this.aggregateReportOptions,
      settings: this.settings
    };

    this.previewTable = {
      assessmentDefinition: this.currentAssessmentDefinition,
      options: this.aggregateReportOptions,
      rows: []
    };

    this.options = optionMapper.map(this.aggregateReportOptions);

    this.organizationTypeaheadOptions = Observable.create(observer => {
      observer.next(this.organizationTypeahead.value);
    }).mergeMap(search => this.organizationService.getOrganizationsMatchingName(search)
      .map(organizations => organizations.filter(
        organization => this.organizations.findIndex(x => organization.equals(x)) === -1
      ))
    );

    this.formGroup = new FormGroup({
      organizations: new FormControl(this.organizations, organizationValidator(
        { messageId: 'aggregate-reports.form.field.organization.error-invalid' },
        this.settings
      )),
      assessmentGrades: new FormControl(this.settings.assessmentGrades, notEmpty(
        { messageId: 'aggregate-reports.form.field.assessment-grades.error-empty' }
      )),
      schoolYears: new FormControl(this.settings.schoolYears, notEmpty(
        { messageId: 'aggregate-reports.form.field.school-year.error-empty' }
      )),
      reportName: new FormControl(this.settings.name, fileName(
        { messageId: 'aggregate-reports.form.field.report-name.error-file-name' }
      ))
    });

  }

  /**
   * @returns {boolean} True if the user does not have access to create aggregate reports
   */
  get accessDenied(): boolean {
    return this.aggregateReportOptions.assessmentTypes.length === 0;
  }

  /**
   * @returns {FormControl} The organizations form control
   */
  get organizationsControl(): FormControl {
    return <FormControl>this.formGroup.get('organizations');
  }

  /**
   * @returns {FormControl} The assessment grades form control
   */
  get assessmentGradesControl(): FormControl {
    return <FormControl>this.formGroup.get('assessmentGrades');
  }

  /**
   * @returns {FormControl} The school years form control
   */
  get schoolYearsControl(): FormControl {
    return <FormControl>this.formGroup.get('schoolYears');
  }

  /**
   * @returns {FormControl} The report name form control
   */
  get reportNameControl(): FormControl {
    return <FormControl>this.formGroup.get('reportName');
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
    return !this.currentAssessmentDefinition.interim;
  }

  /**
   * @returns {boolean} <code>true</code> if an non-summative assessment type is selected
   */
  get summativeFieldsDisabled(): boolean {
    return !this.interimFieldsDisabled;
  }

  get currentAssessmentDefinition(): AssessmentDefinition {
    return this.assessmentDefinitionsByTypeCode.get(this.settings.assessmentType);
  }

  /**
   * Organization typeahead select handler
   *
   * @param organization the selected organization
   */
  onOrganizationTypeaheadSelect(organization: any): void {
    this.organizationTypeahead.value = '';
    this.addOrganization(organization);
  }

  /**
   * Organization list close handler
   *
   * @param organization
   */
  onOrganizationListItemClose(organization: any): void {
    this.removeOrganization(organization);
  }

  onIncludeStateResultsChange(): void {
    this.markOrganizationsControlTouched();
  }

  onIncludeAllDistrictsChange(): void {
    this.markOrganizationsControlTouched();
  }

  onColumnOrderChange(items: OrderableItem[]): void {
    this.settings.columnOrder = items.map(item => item.value);
  }

  private markOrganizationsControlTouched(): void {
    this.organizationsControl.markAsDirty();
    this.organizations = this.organizations.concat();
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
      this.organizationsControl.markAsTouched();
      this.addOrganizationToSettings(organization);
    }
  }

  private addOrganizationToSettings(organization: Organization): void {
    this.organizations = this.organizations.concat(organization);
    if (organization.type === OrganizationType.District) {
      this.settings.districts.push(<District>organization);
      this.settings.districts.sort(OrganizationComparator);
    } else if (organization.type === OrganizationType.School) {
      this.settings.schools.push(<School>organization);
      this.settings.schools.sort(OrganizationComparator);
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
      this.organizationsControl.markAsTouched();
      this.removeOrganizationFromSettings(organization, finder);
    }
  }

  private removeOrganizationFromSettings(organization: Organization, finder: any): void {
    this.organizations = this.organizations.filter(value => !organization.equals(value));
    if (organization.type === OrganizationType.District) {
      this.settings.districts.splice(this.settings.districts.findIndex(finder), 1);
    } else if (organization.type === OrganizationType.School) {
      this.settings.schools.splice(this.settings.schools.findIndex(finder), 1);
    }
  }

  /**
   * Creates a report if the form is valid
   */
  onGenerateButtonClick(): void {
    this.validate(this.formGroup, () => {
      this.reportService.createReport(this.createReportRequest())
        .subscribe(
          resource => {
            this.router.navigate([ resource.id ], { relativeTo: this.route });
          },
          error => {
            this.notificationService.error({ id: 'labels.reports.messages.submission-failed.html', html: true });
          }
        );
    });
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

  /**
   * Creates an aggregate report request from a
   *
   * @returns {AggregateReportRequest} the created request
   */
  private createReportRequest(): AggregateReportRequest {
    return this.requestMapper.map(this.options, this.settings, this.currentAssessmentDefinition);
  }

  /**
   * Reloads the report preview based on current form state
   */
  onSettingsChange() {

    const assessmentDefinition = this.currentAssessmentDefinition;

    this.summary = {
      assessmentDefinition: assessmentDefinition,
      options: this.aggregateReportOptions,
      settings: this.settings
    };

    // TODO this table should be lazily updated when it is scrolled into view. There is serious lag when changing settings above
    this.previewTable = {
      assessmentDefinition: assessmentDefinition,
      options: this.aggregateReportOptions,
      rows: this.tableDataService.createSampleData(assessmentDefinition, this.settings)
    };

  }

}
