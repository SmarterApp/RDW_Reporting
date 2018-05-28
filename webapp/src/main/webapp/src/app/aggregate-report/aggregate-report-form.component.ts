import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AggregateReportFormOptions } from './aggregate-report-form-options';
import { AggregateReportFormSettings } from './aggregate-report-form-settings';
import { NotificationService } from '../shared/notification/notification.service';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Forms } from '../shared/form/forms';
import { District, Organization, OrganizationType, School } from '../shared/organization/organization';
import { Observable } from 'rxjs/Observable';
import { OrganizationTypeahead } from '../shared/organization/organization-typeahead';
import { AggregateReportOrganizationService } from './aggregate-report-organization.service';
import { AggregateReportService } from './aggregate-report.service';
import { AggregateReportTable, SupportedRowCount } from './results/aggregate-report-table.component';
import { AggregateReportRequest } from '../report/aggregate-report-request';
import { AggregateReportOptionsMapper } from './aggregate-report-options.mapper';
import { AggregateReportTableDataService } from './aggregate-report-table-data.service';
import { AssessmentDefinition } from './assessment/assessment-definition';
import { AggregateReportOptions } from './aggregate-report-options';
import { AggregateReportRequestMapper } from './aggregate-report-request.mapper';
import { AggregateReportColumnOrderItemProvider } from './aggregate-report-column-order-item.provider';
import { OrderableItem } from '../shared/order-selector/order-selector.component';
import { AggregateReportRequestSummary } from './aggregate-report-summary.component';
import { Subscription } from 'rxjs/Subscription';
import { finalize, map, mergeMap } from 'rxjs/operators';
import { Observer } from 'rxjs/Observer';
import { ranking } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { SubgroupFilters, SubgroupFilterSupport } from './subgroup/subgroup-filters';
import { SubgroupMapper } from './subgroup/subgroup.mapper';
import { fileName, isGreaterThanOne, notEmpty, withinBounds } from '../shared/form/validators';
import { SubgroupItem } from './subgroup/subgroup-item';
import { Utils } from '../shared/support/support';
import { Claim } from './aggregate-report-options.service';
import { Option as SbCheckboxGroupOption } from '../shared/form/sb-checkbox-group.component';
import { AssessmentDefinitionService } from './assessment/assessment-definition.service';

const OrganizationComparator = (a: Organization, b: Organization) => a.name.localeCompare(b.name);

/**
 * Aggregate report form component
 */
@Component({
  selector: 'aggregate-report-form',
  templateUrl: './aggregate-report-form.component.html'
})
export class AggregateReportFormComponent {

  /**
   * Holds the form's filtered options
   */
  filteredOptions: AggregateReportFormOptions;

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
   * Estimated row count based on the given report form settings
   */
  estimatedRowCount: number;

  /**
   * The report request summary view
   */
  summary: AggregateReportRequestSummary;

  /**
   * The current column order
   */
  columnItems: OrderableItem[];

  /**
   * Determines whether or not the advanced filters section is visible
   */
  showAdvancedFilters = false;

  /**
   * Handle on the request submission
   */
  submissionSubscription: Subscription;

  /**
   * Holds the custom subgroup form state
   */
  customSubgroup: SubgroupFilters;

  /**
   * Custom subgroup display items
   */
  subgroupItems: SubgroupItem[] = [];

  /**
   * Lowest available school year
   */
  lowestAvailableSchoolYear: number;

  private options: AggregateReportFormOptions;

  /**
   * Controls for view invalidation
   */
  reviewSectionInvalid: Observer<void>;
  reviewSectionViewInvalidator: Observable<void> = Observable.create(observer => this.reviewSectionInvalid = observer);

  previewSectionInvalid: Observer<void>;
  previewSectionViewInvalidator: Observable<void> = Observable.create(observer => this.previewSectionInvalid = observer);

  constructor(@Inject(FormBuilder) formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private optionMapper: AggregateReportOptionsMapper,
              private requestMapper: AggregateReportRequestMapper,
              private notificationService: NotificationService,
              private organizationService: AggregateReportOrganizationService,
              private assessmentDefinitionService: AssessmentDefinitionService,
              private reportService: AggregateReportService,
              private tableDataService: AggregateReportTableDataService,
              private columnOrderableItemProvider: AggregateReportColumnOrderItemProvider,
              private subgroupMapper: SubgroupMapper) {

    this.aggregateReportOptions = route.snapshot.data[ 'options' ];
    this.settings = route.snapshot.data[ 'settings' ];

    this.customSubgroup = SubgroupFilterSupport.copy(this.aggregateReportOptions.studentFilters);
    this.subgroupItems = this.settings.subgroups
      .map(subgroup => this.subgroupMapper.createItemsFromFilters(subgroup, this.aggregateReportOptions.dimensionTypes));

    this.showAdvancedFilters = !SubgroupFilterSupport.equals(this.settings.studentFilters, this.aggregateReportOptions.studentFilters);

    this.organizations = this.organizations.concat(this.settings.districts, this.settings.schools);

    const defaultOrganization = this.aggregateReportOptions.defaultOrganization;
    if (this.organizations.length === 0 && defaultOrganization) {
      this.addOrganizationToSettings(defaultOrganization);
    }

    this.columnItems = this.columnOrderableItemProvider.toOrderableItems(this.settings.columnOrder);

    this.options = optionMapper.map(this.aggregateReportOptions);
    this.lowestAvailableSchoolYear = Math.min(...this.options.schoolYears.map(schoolYear => schoolYear.value));
    if (!this.settings.assessmentType.includes('sum')) {
      this.options.reportTypes = this.options.reportTypes.filter(reportType => reportType.value !== 'LongitudinalCohort');
    }
    this.filteredOptions = Object.assign({}, this.options);
    if (this.settings.reportType === 'Claim') {
      this.filteredOptions.claimCodes = this.filteredOptions.claimCodes
        .filter(claim => this.settings.subjects.includes(claim.value.subject)
          && claim.value.assessmentType === this.settings.assessmentType);
      if (this.settings.claimReport.claimCodesBySubject.length === 0) {
        // selected All
        this.filteredOptions.claimCodes.forEach(claim => {
          this.settings.claimReport.claimCodesBySubject.push(claim.value);
        });
      }
    }

    this.organizationTypeaheadOptions = Observable.create(observer => {
      observer.next(this.organizationTypeahead.value);
    }).pipe(
      mergeMap((search: string) => this.organizationService.getOrganizationsMatchingName(search)),
      map((organizations: Organization[]) => organizations.filter(
        organization => this.organizations.findIndex(x => organization.equals(x)) === -1
      ))
    );

    this.formGroup = formBuilder.group({
      organizations: [
        this.organizations,
        control => {
          return this.includeStateResults
          || this.settings.includeAllDistricts
          || control.value.length
            ? null
            : { invalid: { messageId: 'aggregate-report-form.field.organization-invalid-error' } };
        }
      ],
      reportName: [
        this.settings.name,
        fileName({ messageId: 'aggregate-report-form.field.report-name-file-name-error' })
      ],
      assessmentGrades: [ this.settings.generalPopulation.assessmentGrades ],
      schoolYears: [ this.settings.generalPopulation.schoolYears ],
      assessmentGradeRange: [ this.settings.longitudinalCohort.assessmentGrades ],
      toSchoolYear: [ this.settings.longitudinalCohort.toSchoolYear ],
      claimAssessmentGrades: [ this.settings.claimReport.assessmentGrades ],
      claimSchoolYears: [ this.settings.claimReport.schoolYears ]
    });
  }

  get effectiveReportType() {
    return this.reportService.getEffectiveReportType(this.settings.reportType, this.currentAssessmentDefinition);
  }

  private updateValidators(): void {
    const setValidators = (control: FormControl, validators: ValidatorFn | ValidatorFn[] | null): void => {
      control.setValidators(validators);
      control.updateValueAndValidity();
    };

    if (this.effectiveReportType === 'GeneralPopulation') {
      setValidators(this.assessmentGradesControl, [
        notEmpty({ messageId: 'aggregate-report-form.field.assessment-grades-empty-error' })
      ]);
      setValidators(this.schoolYearsControl, [
        notEmpty({ messageId: 'aggregate-report-form.field.school-year-empty-error' })
      ]);
      setValidators(this.assessmentGradeRangeControl, null);
      setValidators(this.claimAssessmentGradesControl, null);
      setValidators(this.claimSchoolYearsControl, null);
    } else if (this.effectiveReportType === 'LongitudinalCohort') {
      setValidators(this.assessmentGradesControl, null);
      setValidators(this.schoolYearsControl, null);
      setValidators(this.claimAssessmentGradesControl, null);
      setValidators(this.claimSchoolYearsControl, null);
      setValidators(this.assessmentGradeRangeControl, [
        isGreaterThanOne({ messageId: 'aggregate-report-form.field.assessment-grades-less-than-minimum-error' }),
        withinBounds(this.settings.longitudinalCohort.toSchoolYear,
          this.settings.longitudinalCohort.assessmentGrades,
          this.lowestAvailableSchoolYear,
          { messageId: 'aggregate-report-form.field.assessment-grades-exceed-available-school-years-error' })
      ]);
    } else if (this.effectiveReportType === 'Claim') {
      setValidators(this.assessmentGradeRangeControl, null);
      setValidators(this.assessmentGradesControl, null);
      setValidators(this.schoolYearsControl, null);
      setValidators(this.claimAssessmentGradesControl, [
        notEmpty({ messageId: 'aggregate-report-form.field.assessment-grades-empty-error' })
      ]);
      setValidators(this.claimSchoolYearsControl, [
        notEmpty({ messageId: 'aggregate-report-form.field.school-year-empty-error' })
      ]);
    }
  }

  /**
   * @returns {boolean} True if the default organization exists and it is a school
   */
  get hasDefaultSchoolOrganization(): boolean {
    return this.defaultOrganization && this.defaultOrganization.type === OrganizationType.School;
  }

  /**
   * @returns {Organization} The default organization, if one exists
   */
  get defaultOrganization(): Organization {
    return this.aggregateReportOptions.defaultOrganization;
  }

  /**
   * @returns {boolean} True if the user does not have access to create aggregate reports
   */
  get accessDenied(): boolean {
    return this.aggregateReportOptions.assessmentTypes.length === 0;
  }

  get organizationsControl(): FormControl {
    return <FormControl>this.formGroup.get('organizations');
  }

  get assessmentGradesControl(): FormControl {
    return <FormControl>this.formGroup.get('assessmentGrades');
  }

  get schoolYearsControl(): FormControl {
    return <FormControl>this.formGroup.get('schoolYears');
  }

  get reportNameControl(): FormControl {
    return <FormControl>this.formGroup.get('reportName');
  }

  get assessmentGradeRangeControl(): FormControl {
    return <FormControl>this.formGroup.get('assessmentGradeRange');
  }

  get toSchoolYearControl(): FormControl {
    return <FormControl>this.formGroup.get('toSchoolYear');
  }

  get claimAssessmentGradesControl(): FormControl {
    return <FormControl>this.formGroup.get('claimAssessmentGrades');
  }

  get claimSchoolYearsControl(): FormControl {
    return <FormControl>this.formGroup.get('claimSchoolYears');
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
    return this.assessmentDefinitionService.get(this.settings.assessmentType, this.settings.reportType);
  }

  get estimatedRowCountIsLarge(): boolean {
    return this.estimatedRowCount > SupportedRowCount;
  }

  get includeStateResults(): boolean {
    return this.settings.includeStateResults && !this.summativeFieldsDisabled;
  }

  set includeStateResults(value: boolean) {
    this.settings.includeStateResults = value;
  }

  get createCustomSubgroupButtonDisabled(): boolean {
    return SubgroupFilterSupport.equals(this.customSubgroup, this.aggregateReportOptions.studentFilters)
      || this.settings.subgroups.some(subgroup => SubgroupFilterSupport.equals(
        subgroup,
        SubgroupFilterSupport.leftDifference(this.customSubgroup, this.aggregateReportOptions.studentFilters)
      ));
  }

  onReportTypeChange(): void {
    if (this.effectiveReportType === 'Claim') {
      this.filteredOptions.assessmentTypes = this.options.assessmentTypes.filter(assessmentType => assessmentType.value !== 'iab');
      this.filterClaimCodes();
    } else if (this.effectiveReportType === 'LongitudinalCohort') {
      this.filteredOptions.assessmentTypes = this.options.assessmentTypes.filter(assessmentType => assessmentType.value !== 'iab'
        && assessmentType.value !== 'ica');
    } else {
      this.filteredOptions.assessmentTypes = this.options.assessmentTypes;
    }
    this.setColumnOrder();
    this.onSettingsChange();
  }

  onTabChange(queryType: 'Basic' | 'FilteredSubgroup'): void {
    this.settings.queryType = queryType;
    this.onSettingsChange();
  }

  onCreateCustomSubgroupButtonClick(): void {
    const created = SubgroupFilterSupport
      .leftDifference(this.customSubgroup, this.aggregateReportOptions.studentFilters);

    const createdItem = this.subgroupMapper
      .createItemsFromFilters(created, this.aggregateReportOptions.dimensionTypes);

    this.settings.subgroups = this.settings.subgroups.concat(created);
    this.subgroupItems = this.subgroupItems.concat(createdItem);

    this.onSettingsChange();
  }

  onCustomSubgroupItemRemoveButtonClick(item: SubgroupItem): void {
    this.settings.subgroups = this.settings.subgroups
      .filter(subgroup => subgroup !== item.source);
    this.subgroupItems = this.subgroupItems
      .filter(subgroup => subgroup !== item);
    this.onSettingsChange();
  }

  /**
   * Organization typeahead select handler
   *
   * @param organization the selected organization
   */
  onOrganizationTypeaheadSelect(organization: any): void {
    this.organizationTypeahead.value = '';
    this.addOrganization(organization);
    this.markOrganizationsControlTouched();
    this.onSettingsChange();
  }

  /**
   * Organization list close handler
   *
   * @param organization
   */
  onOrganizationListItemClose(organization: any): void {
    this.removeOrganization(organization);
    this.onSettingsChange();
  }

  onIncludeStateResultsChange(): void {
    this.markOrganizationsControlTouched();
    this.onSettingsChange();
  }

  onIncludeAllDistrictsChange(): void {
    this.markOrganizationsControlTouched();
    this.onSettingsChange();
  }

  onAdvancedFiltersExpanderButtonClick(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  setColumnOrder() {

    let order = this.currentAssessmentDefinition.aggregateReportIdentityColumns.concat();
    if (this.settings.reportType === 'Claim') {
      order = order.concat([ 'claim' ]);
    }

    // Preserve column order between changing assessment types
    const currentOrder = order.concat();
    if (!currentOrder.includes('assessmentLabel')) {
      currentOrder.splice(currentOrder.indexOf('assessmentGrade') + 1, 0, 'assessmentLabel');
    }

    order = order.sort(ordering(ranking(currentOrder)).compare);
    this.settings.columnOrder = order;
    this.columnItems = this.columnOrderableItemProvider.toOrderableItems(order);
  }

  onAssessmentTypeChange(): void {
    this.filterClaimCodes();
    this.setColumnOrder();


    this.options.reportTypes.forEach(reportType => reportType.disabled = false);
    if (!this.currentAssessmentDefinition.aggregateReportTypes.includes('LongitudinalCohort') && this.currentAssessmentDefinition.aggregateReportTypes.includes('Claim')) {
      this.filteredOptions.reportTypes = this.options.reportTypes.map(reportType => {
        if (reportType.value === 'LongitudinalCohort') {
          reportType.disabled = true;
        }
        return reportType;
      });
    } else if (this.currentAssessmentDefinition.aggregateReportTypes.includes('GeneralPopulation')) {
      this.filteredOptions.reportTypes = this.options.reportTypes.map(reportType => {
        if (reportType.value !== 'GeneralPopulation') {
          reportType.disabled = true;
        }
        return reportType;
      });
    } else {
      this.filteredOptions.reportTypes = this.options.reportTypes;
    }


    this.markOrganizationsControlTouched();
    this.onSettingsChange();
  }

  onColumnOrderChange(items: OrderableItem[]): void {
    this.settings.columnOrder = items.map(item => item.value);
  }

  onReviewSectionInView(): void {
    // compute and render estimated row count
    if (this.formGroup.valid && this.capableOfRowEstimation()) {
      this.reportService.getEstimatedRowCount(this.createReportRequest().query)
        .subscribe(count => this.estimatedRowCount = count);
    }
    // compute and render summary data
    this.summary = {
      assessmentDefinition: this.currentAssessmentDefinition,
      options: this.aggregateReportOptions,
      settings: this.settings
    };
  }

  capableOfRowEstimation(): boolean {
    return (
      // summative & include state results
      (this.settings.assessmentType === 'sum' && this.settings.includeStateResults
        // or anything include schools or districts
        || !Utils.isNullOrEmpty(this.settings.schools) || !Utils.isNullOrEmpty(this.settings.districts))
      && (
        // and has at least one grade
        !Utils.isNullOrEmpty(this.settings.generalPopulation.assessmentGrades)
        || !Utils.isNullOrEmpty(this.settings.longitudinalCohort.assessmentGrades)
        || !Utils.isNullOrEmpty(this.settings.claimReport.assessmentGrades)
      )
      && (
        // and has at least one schools years
        !Utils.isNullOrEmpty(this.settings.generalPopulation.schoolYears)
        || !Utils.isNullOrEmpty(this.settings.claimReport.schoolYears)
        || this.settings.longitudinalCohort.toSchoolYear > 0
      )
    );
  }

  onPreviewSectionInView(): void {
    // compute and render preview table
    this.previewTable = {
      assessmentDefinition: this.currentAssessmentDefinition,
      options: this.aggregateReportOptions,
      rows: this.tableDataService.createSampleData(
        this.currentAssessmentDefinition,
        this.settings,
        this.aggregateReportOptions
      ),
      reportType: this.settings.reportType
    };
  }

  onSubjectsChange(): void {
    this.onSettingsChange();
    this.filterClaimCodes();
  }

  /**
   * Reloads the report preview based on current form state
   */
  onSettingsChange(): void {
    this.updateValidators();

    // invalidate all setting-dependent views
    this.estimatedRowCount = undefined;
    if (this.reviewSectionInvalid) {
      this.reviewSectionInvalid.next(undefined);
    }
    if (this.previewSectionInvalid) {
      this.previewSectionInvalid.next(undefined);
    }
  }

  /**
   * Creates a report if the form is valid
   */
  onGenerateButtonClick(): void {
    this.validate(this.formGroup, () => {
      this.submissionSubscription = this.reportService.createReport(this.createReportRequest())
        .pipe(
          finalize(() => {
            this.submissionSubscription.unsubscribe();
            this.submissionSubscription = undefined;
          })
        )
        .subscribe(
          resource => {
            this.router.navigate([ resource.id ], { relativeTo: this.route });
          },
          error => {
            this.notificationService.error({ id: 'common.messages.submission-failed', html: true });
          }
        );
    });
  }

  private filterClaimCodes(): void {
    if (this.settings.reportType === 'Claim') {
      this.filteredOptions.claimCodes = this.options.claimCodes.filter((claim: SbCheckboxGroupOption) => {
        return claim.value.assessmentType === this.settings.assessmentType && this.settings.subjects.includes(claim.value.subject);
      });
    }
  }

  private markOrganizationsControlTouched(): void {
    this.organizationsControl.setValue(this.organizations);
    this.organizationsControl.markAsDirty();
    this.organizationsControl.updateValueAndValidity();
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
      this.addOrganizationToSettings(organization);
    }
  }

  private addOrganizationToSettings(organization: Organization): void {
    this.organizations = this.organizations.concat(organization);
    if (organization.type === OrganizationType.District) {
      this.settings.districts = this.settings.districts
        .concat(<District>organization)
        .sort(OrganizationComparator);
    } else if (organization.type === OrganizationType.School) {
      this.settings.schools = this.settings.schools
        .concat(<School>organization)
        .sort(OrganizationComparator);
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
      this.removeOrganizationFromSettings(organization);
    }
  }

  private removeOrganizationFromSettings(organization: Organization): void {
    this.organizations = this.organizations.filter(value => !organization.equals(value));
    if (organization.type === OrganizationType.District) {
      this.settings.districts = this.settings.districts
        .filter(district => !organization.equals(district));
    } else if (organization.type === OrganizationType.School) {
      this.settings.schools = this.settings.schools
        .filter(school => !organization.equals(school));
    }
    this.markOrganizationsControlTouched();
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

    this.formGroup.updateValueAndValidity();

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
    return this.requestMapper.map(this.filteredOptions, this.settings, this.currentAssessmentDefinition);
  }

}


