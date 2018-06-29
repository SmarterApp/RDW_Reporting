import { BaseAggregateQueryFormComponent } from "./base-aggregate-query-form.component";
import { District, Organization, OrganizationType, School } from "../../shared/organization/organization";
import { OrganizationTypeahead } from "../../shared/organization/organization-typeahead";
import { ViewChild } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { NotificationService } from "../../shared/notification/notification.service";
import { AggregateReportOptionsMapper } from "../aggregate-report-options.mapper";
import { AggregateReportService } from "../aggregate-report.service";
import { AggregateReportRequestMapper } from "../aggregate-report-request.mapper";
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportTableDataService } from "../aggregate-report-table-data.service";
import { AggregateReportOrganizationService } from "../aggregate-report-organization.service";
import { map, mergeMap } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { AggregateReportColumnOrderItemProvider } from "../aggregate-report-column-order-item.provider";
import { SubgroupFilters, SubgroupFilterSupport } from "../subgroup/subgroup-filters";
import { SubgroupMapper } from "../subgroup/subgroup.mapper";
import { SubgroupItem } from "../subgroup/subgroup-item";
import { SupportedRowCount } from "../results/aggregate-report-table.component";
import { SubjectService } from '../../subject/subject.service';

const OrganizationComparator = (a: Organization, b: Organization) => a.name.localeCompare(b.name);

/**
 * Base query component implementation for the multi-organization aggregate report types:
 * GeneralPopulation, LongitudinalCohort, and Claim.
 */
export abstract class MultiOrganizationQueryFormComponent extends BaseAggregateQueryFormComponent {

  /**
   * The organization typeahead
   */
  @ViewChild('organizationTypeahead')
  organizationTypeahead: OrganizationTypeahead;

  /**
   * Holds the custom subgroup form state
   */
  customSubgroup: SubgroupFilters;

  /**
   * Estimated row count based on the given report form settings
   */
  estimatedRowCount: number;

  /**
   * True if the user has access to only a single school
   */
  hasDefaultSchoolOrganization: boolean;

  /**
   * The selected organizations
   */
  organizations: Organization[] = [];

  /**
   * The organization typeahead options
   */
  organizationTypeaheadOptions: Observable<Organization[]>;

  /**
   * Custom subgroup display items
   */
  subgroupItems: SubgroupItem[] = [];

  constructor(protected columnOrderableItemProvider: AggregateReportColumnOrderItemProvider,
              protected notificationService: NotificationService,
              protected optionMapper: AggregateReportOptionsMapper,
              protected organizationService: AggregateReportOrganizationService,
              protected reportService: AggregateReportService,
              protected subjectService: SubjectService,
              protected requestMapper: AggregateReportRequestMapper,
              protected route: ActivatedRoute,
              protected router: Router,
              protected subgroupMapper: SubgroupMapper,
              protected tableDataService: AggregateReportTableDataService) {
    super(columnOrderableItemProvider, notificationService, optionMapper, reportService, subjectService, requestMapper, route, router, tableDataService);

    this.customSubgroup = SubgroupFilterSupport.copy(this.aggregateReportOptions.studentFilters);
    this.subgroupItems = this.settings.subgroups
      .map(subgroup => this.subgroupMapper.createItemsFromFilters(subgroup, this.aggregateReportOptions.dimensionTypes));

    this.organizations = this.organizations.concat(this.settings.districts, this.settings.schools);

    const defaultOrganization: Organization = this.aggregateReportOptions.defaultOrganization;
    if (this.organizations.length === 0 && defaultOrganization) {
      this.hasDefaultSchoolOrganization = defaultOrganization.type === OrganizationType.School;
      this.addOrganizationToSettings(defaultOrganization);
    }

    this.organizationTypeaheadOptions = Observable.create(observer => {
      observer.next(this.organizationTypeahead.value);
    }).pipe(
      mergeMap((search: string) => this.organizationService.getOrganizationsMatchingName(search)),
      map((organizations: Organization[]) => organizations.filter(
        organization => this.organizations.findIndex(x => organization.equals(x)) === -1
      ))
    );
  }

  protected abstract capableOfRowEstimation(): boolean;

  get estimatedRowCountIsLarge(): boolean {
    return this.estimatedRowCount > SupportedRowCount;
  }

  get includeStateResults(): boolean {
    return this.settings.includeStateResults && !this.getAssessmentDefinition().interim;
  }

  set includeStateResults(value: boolean) {
    this.settings.includeStateResults = value;
  }

  get organizationsControl(): FormControl {
    return <FormControl>this.getFormGroup().get('organizations');
  }

  get createCustomSubgroupButtonDisabled(): boolean {
    return SubgroupFilterSupport.equals(this.customSubgroup, this.aggregateReportOptions.studentFilters)
      || this.settings.subgroups.some(subgroup => SubgroupFilterSupport.equals(
        subgroup,
        SubgroupFilterSupport.leftDifference(this.customSubgroup, this.aggregateReportOptions.studentFilters)
      ));
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

  onIncludeStateResultsChange(): void {
    this.markOrganizationsControlTouched();
    this.onSettingsChange();
  }

  onIncludeAllDistrictsChange(): void {
    this.markOrganizationsControlTouched();
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

  onReviewSectionInView(): void {
    // compute and render estimated row count
    if (this.getFormGroup().valid && this.capableOfRowEstimation()) {
      this.reportService.getEstimatedRowCount(this.createReportRequest().query)
        .subscribe(count => this.estimatedRowCount = count);
    }

    super.onReviewSectionInView();
  }

  /**
   * Reloads the report preview based on current form state
   */
  onSettingsChange(): void {
    // invalidate all setting-dependent views
    this.estimatedRowCount = undefined;

    super.onSettingsChange();
  }

  onTabChange(queryType: 'Basic' | 'FilteredSubgroup'): void {
    this.settings.queryType = queryType;
    this.onSettingsChange();
  }

  /**
   * Adds an organization to the selected organizations
   *
   * @param {Organization} organization
   */
  protected addOrganization(organization: Organization): void {
    const finder = value => value.equals(organization);
    const index = this.organizations.findIndex(finder);
    if (index === -1) {
      this.addOrganizationToSettings(organization);
    }
  }

  protected addOrganizationToSettings(organization: Organization): void {
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
  protected removeOrganization(organization: Organization): void {
    const finder = value => value.equals(organization);
    const index = this.organizations.findIndex(finder);
    if (index !== -1) {
      this.removeOrganizationFromSettings(organization);
    }
  }

  protected removeOrganizationFromSettings(organization: Organization): void {
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

  protected markOrganizationsControlTouched(): void {
    this.organizationsControl.setValue(this.organizations);
    this.organizationsControl.markAsDirty();
    this.organizationsControl.updateValueAndValidity();
  }
}
