import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { AggregateReportFormSettings } from "../aggregate-report-form-settings";
import { AggregateReportFormOptions } from "../aggregate-report-form-options";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { District, Organization, OrganizationType, School } from "../../shared/organization/organization";
import { AggregateReportTable } from "../results/aggregate-report-table.component";
import { AggregateReportRequestSummary } from "../aggregate-report-summary.component";
import { Subscription } from "rxjs/Subscription";
import { OrderableItem } from "../../shared/order-selector/order-selector.component";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportOptionsMapper } from "../aggregate-report-options.mapper";
import { AggregateReportRequestMapper } from "../aggregate-report-request.mapper";
import { NotificationService } from "../../shared/notification/notification.service";
import { AggregateReportOrganizationService } from "../aggregate-report-organization.service";
import { AssessmentDefinitionService, TargetSummativeKey } from "../assessment/assessment-definition.service";
import { AggregateReportService } from "../aggregate-report.service";
import { AggregateReportTableDataService } from "../aggregate-report-table-data.service";
import { AggregateReportColumnOrderItemProvider } from "../aggregate-report-column-order-item.provider";
import { SubgroupMapper } from "../subgroup/subgroup.mapper";
import { AggregateReportOptions } from "../aggregate-report-options";
import { SubgroupFilterSupport } from "../subgroup/subgroup-filters";
import { OrganizationTypeahead } from "../../shared/organization/organization-typeahead";
import { mergeMap } from "rxjs/operators";
import { fileName } from "../../shared/form/validators";
import { Forms } from "../../shared/form/forms";
import { AssessmentDefinition } from "../assessment/assessment-definition";
import { Utils } from "../../shared/support/support";

@Component({
  selector: 'target-report-form',
  templateUrl: './target-report-form.component.html'
})
export class TargetReportFormComponent implements OnInit {

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
   * The selected organization
   */
  organization: Organization;

  /**
   * The preview table data
   */
  previewTable: AggregateReportTable;

  /**
   * Holds the server report options
   */
  aggregateReportOptions: AggregateReportOptions;

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

  private options: AggregateReportFormOptions;
  private assessmentDefinition: AssessmentDefinition;

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
    this.settings.reportType = 'Target';

    this.options = optionMapper.map(this.aggregateReportOptions);
    this.filteredOptions = Object.assign({}, this.options);

    this.assessmentDefinition = this.assessmentDefinitionService.get(TargetSummativeKey.assessmentType, TargetSummativeKey.reportType);

    this.settings.columnOrder = this.getInitialColumnOrder();
    this.columnItems = this.columnOrderableItemProvider.toOrderableItems(this.settings.columnOrder);

    this.showAdvancedFilters = !SubgroupFilterSupport.equals(this.settings.studentFilters, this.aggregateReportOptions.studentFilters);

    this.settings.includeAllDistricts = false;
    this.settings.includeStateResults = false;
    this.settings.includeAllDistrictsOfSelectedSchools = false;
    this.settings.includeAllSchoolsOfSelectedDistricts = false;

    this.organization = this.settings.districts.length
      ? this.settings.districts[0]
      : this.settings.schools.length
        ? this.settings.schools[0]
        : undefined;

    const defaultOrganization = this.aggregateReportOptions.defaultOrganization;
    if (!this.organization && defaultOrganization) {
      this.setOrganization(defaultOrganization);
    }

    this.organizationTypeaheadOptions = Observable.create(observer => {
      observer.next(this.organizationTypeahead.value);
    }).pipe(
      mergeMap((search: string) => this.organizationService.getOrganizationsMatchingName(search))
    );

    this.formGroup = formBuilder.group({
      organization: [ this.organization,
        control => {
          return control.value
            ? null
            : { invalid: { messageId: 'aggregate-report-form.field.organization-invalid-error' } };
        }
      ],
      reportName: [
        this.settings.name,
        fileName({ messageId: 'aggregate-report-form.field.report-name-file-name-error' })
      ],
      assessmentGrade: [ this.settings.generalPopulation.assessmentGrades ],
      schoolYear: [ this.settings.generalPopulation.schoolYears ],
    });
  }

  ngOnInit(): void {
    if (!Utils.isNullOrUndefined(this.organization)) {
      this.organizationTypeahead.value = this.organization.name;
    }
  }

  /**
   * Organization typeahead select handler
   *
   * @param organization the selected organization
   */
  onOrganizationTypeaheadSelect(organization: any): void {
    this.setOrganization(organization);
    this.onSettingsChange();
  }

  /**
   * Reloads the report preview based on current form state
   */
  onSettingsChange(): void {
    // invalidate all setting-dependent views
    if (this.reviewSectionInvalid) {
      this.reviewSectionInvalid.next(undefined);
    }
    if (this.previewSectionInvalid) {
      this.previewSectionInvalid.next(undefined);
    }
  }

  onColumnOrderChange(items: OrderableItem[]): void {
    this.settings.columnOrder = items.map(item => item.value);
  }

  onReviewSectionInView(): void {
    // compute and render summary data
    this.summary = {
      assessmentDefinition: this.assessmentDefinition,
      options: this.aggregateReportOptions,
      settings: this.settings
    };
  }

  onPreviewSectionInView(): void {
    // compute and render preview table
    this.previewTable = {
      assessmentDefinition: this.assessmentDefinition,
      options: this.aggregateReportOptions,
      rows: this.tableDataService.createSampleData(
        this.assessmentDefinition,
        this.settings,
        this.aggregateReportOptions
      ),
      reportType: this.settings.reportType
    };
  }

  /**
   * @returns {boolean} true if the control has errors and has been touched or dirtied
   */
  showErrors(formControl: FormControl): boolean {
    return Forms.showErrors(formControl);
  }

  private setOrganization(organization: Organization): void {
    this.organization = organization;
    if (organization.type === OrganizationType.District) {
      this.settings.districts = [this.organization as District];
      this.settings.schools = [];
    } else if (organization.type === OrganizationType.School) {
      this.settings.districts = [];
      this.settings.schools = [this.organization as School];
    }
  }

  private getInitialColumnOrder(): string[] {
    const targetColumns: string[] = this.assessmentDefinition.aggregateReportIdentityColumns;
    if (this.settings.columnOrder.length != targetColumns.length) {
      return targetColumns;
    }

    for (let column of this.settings.columnOrder) {
      if (targetColumns.indexOf(column) < 0) {
        return targetColumns;
      }
    }

    return this.settings.columnOrder;
  }
}
