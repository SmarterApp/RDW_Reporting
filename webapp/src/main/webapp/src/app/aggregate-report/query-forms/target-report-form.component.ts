import { Component, Inject, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { District, Organization, OrganizationType, School } from "../../shared/organization/organization";
import { Observable } from "rxjs/Observable";
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportOptionsMapper } from "../aggregate-report-options.mapper";
import { AggregateReportRequestMapper } from "../aggregate-report-request.mapper";
import { NotificationService } from "../../shared/notification/notification.service";
import { AggregateReportOrganizationService } from "../aggregate-report-organization.service";
import { AssessmentDefinitionService, TargetSummativeKey } from "../assessment/assessment-definition.service";
import { AggregateReportService } from "../aggregate-report.service";
import { AggregateReportTableDataService } from "../aggregate-report-table-data.service";
import { AggregateReportColumnOrderItemProvider } from "../aggregate-report-column-order-item.provider";
import { SubgroupFilterSupport } from "../subgroup/subgroup-filters";
import { OrganizationTypeahead } from "../../shared/organization/organization-typeahead";
import { mergeMap } from "rxjs/operators";
import { fileName } from "../../shared/form/validators";
import { AssessmentDefinition } from "../assessment/assessment-definition";
import { Utils } from "../../shared/support/support";
import { BaseAggregateQueryFormComponent } from "./base-aggregate-query-form.component";
import { ScrollNavItem } from "../../shared/nav/scroll-nav.component";
import { AggregateReportType } from "../aggregate-report-form-settings";
import { SubjectService } from '../../subject/subject.service';
import { SubjectDefinition } from '../../subject/subject';

@Component({
  selector: 'target-report-form',
  templateUrl: './target-report-form.component.html'
})
export class TargetReportFormComponent extends BaseAggregateQueryFormComponent {

  /**
   * The organization typeahead
   */
  @ViewChild('organizationTypeahead')
  set organizationTypeahead(value: OrganizationTypeahead) {
    this._organizationTypeahead = value;
    if (!Utils.isNullOrUndefined(this.organization)) {
      setTimeout(() => {
        this._organizationTypeahead.value = this.organization.name;
      });
    }
  }

  /**
   * Responsible for tracking form validity
   */
  formGroup: FormGroup;

  /**
   * The organization typeahead options
   */
  organizationTypeaheadOptions: Observable<Organization[]>;

  /**
   * The selected organization
   */
  organization: Organization;

  /**
   * Determines whether or not the advanced filters section is visible
   */
  showAdvancedFilters = false;

  assessmentDefinition: AssessmentDefinition;

  private _organizationTypeahead: OrganizationTypeahead;

  constructor(protected columnOrderableItemProvider: AggregateReportColumnOrderItemProvider,
              protected notificationService: NotificationService,
              protected optionMapper: AggregateReportOptionsMapper,
              protected reportService: AggregateReportService,
              protected subjectService: SubjectService,
              protected requestMapper: AggregateReportRequestMapper,
              protected route: ActivatedRoute,
              protected router: Router,
              protected tableDataService: AggregateReportTableDataService,
              @Inject(FormBuilder) formBuilder: FormBuilder,
              protected organizationService: AggregateReportOrganizationService,
              protected assessmentDefinitionService: AssessmentDefinitionService) {
    super(columnOrderableItemProvider, notificationService, optionMapper, reportService, subjectService, requestMapper, route, router, tableDataService);

    this.settings.reportType = AggregateReportType.Target;

    this.assessmentDefinition = this.assessmentDefinitionService.get(TargetSummativeKey.assessmentType, TargetSummativeKey.reportType);

    this.updateColumnOrder();

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
      observer.next(this._organizationTypeahead.value);
    }).pipe(
      mergeMap((search: string) => this.organizationService.getOrganizationsMatchingName(search))
    );

    this.formGroup = formBuilder.group({
      organization: [ this.organization,
        control => {
          return control.value
            ? null
            : { invalid: { messageId: 'aggregate-report-form.field.target.organization-invalid-error' } };
        }
      ],
      reportName: [
        this.settings.name,
        fileName({ messageId: 'aggregate-report-form.field.report-name-file-name-error' })
      ],
      assessmentGrade: [ this.settings.targetReport.assessmentGrade ],
      schoolYear: [ this.settings.targetReport.schoolYear ],
    });
  }

  getAssessmentDefinition(): AssessmentDefinition {
    return this.assessmentDefinition;
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  getNavItems(): ScrollNavItem[] {
    return [ {
      id: 'targetOrganizationSection',
      translationKey: 'aggregate-report-form.section.organization.heading'
    }, {
      id: 'targetAssessmentSection',
      translationKey: 'aggregate-report-form.section.assessment-heading'
    }, {
      id: 'targetSubgroupSection',
      translationKey: 'aggregate-report-form.section.comparative-subgroups-heading'
    }, {
      id: 'targetReviewSection',
      translationKey: 'aggregate-report-form.section.review-heading'
    }, {
      id: 'targetPreviewSection',
      translationKey: 'aggregate-report-form.section.preview-heading'
    } ]
  }

  getSupportedAssessmentTypes(): string[] {
    return ['sum'];
  }

  // override the base implementat since the target report stores subject code differently
  get subjectDefinition(): SubjectDefinition {
    return this.subjectDefinitions.find(x => x.subject == this.settings.targetReport.subjectCode && x.assessmentType == this.settings.assessmentType);
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
}
