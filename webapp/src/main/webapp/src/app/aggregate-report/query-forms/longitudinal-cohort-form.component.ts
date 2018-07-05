import { Component, Inject } from "@angular/core";
import { AggregateReportColumnOrderItemProvider } from "../aggregate-report-column-order-item.provider";
import { AssessmentDefinitionService } from "../assessment/assessment-definition.service";
import { AggregateReportOrganizationService } from "../aggregate-report-organization.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AggregateReportTableDataService } from "../aggregate-report-table-data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportRequestMapper } from "../aggregate-report-request.mapper";
import { AggregateReportService } from "../aggregate-report.service";
import { AggregateReportOptionsMapper } from "../aggregate-report-options.mapper";
import { NotificationService } from "../../shared/notification/notification.service";
import { AssessmentDefinition } from "../assessment/assessment-definition";
import { ScrollNavItem } from "../../shared/nav/scroll-nav.component";
import { SubgroupFilterSupport } from "../subgroup/subgroup-filters";
import { SubgroupMapper } from "../subgroup/subgroup.mapper";
import { MultiOrganizationQueryFormComponent } from "./multi-organization-query-form.component";
import { fileName, isGreaterThan, withinBounds } from "../../shared/form/validators";
import { Utils } from "../../shared/support/support";
import { AggregateReportType } from "../aggregate-report-form-settings";
import { SubjectService } from '../../subject/subject.service';

/**
 * Disable StudentEnrolledGrade as a longitudinal dimension type
 * because the value varies year-over-year.
 * @type {[string]}
 */
const DisallowedDimensions = ['StudentEnrolledGrade'];

@Component({
  selector: 'longitudinal-cohort-form',
  templateUrl: './longitudinal-cohort-form.component.html'
})
export class LongitudinalCohortFormComponent extends MultiOrganizationQueryFormComponent {

  assessmentDefinition: AssessmentDefinition;

  /**
   * Responsible for tracking form validity
   */
  formGroup: FormGroup;

  /**
   * Determines whether or not the advanced filters section is visible
   */
  showAdvancedFilters = false;

  private lowestAvailableSchoolYear: number;

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
              protected tableDataService: AggregateReportTableDataService,
              @Inject(FormBuilder) formBuilder: FormBuilder,
              protected assessmentDefinitionService: AssessmentDefinitionService) {
    super(columnOrderableItemProvider, notificationService, optionMapper, organizationService, reportService, subjectService, requestMapper, route, router, subgroupMapper, tableDataService);
    this.settings.reportType = AggregateReportType.LongitudinalCohort;
    this.settings.assessmentType = 'sum';
    console.log("subjects", this.settings.subjects);

    //Strip disallowed dimension types
    this.filteredOptions.dimensionTypes = this.filteredOptions.dimensionTypes
      .filter(({value}) => DisallowedDimensions.indexOf(value) < 0);
    if (this.settings.dimensionTypes) {
      this.settings.dimensionTypes = this.settings.dimensionTypes
        .filter(value => DisallowedDimensions.indexOf(value) < 0);
    }

    this.assessmentDefinition = this.assessmentDefinitionService.get(this.settings.assessmentType, this.settings.reportType);

    this.updateColumnOrder();

    this.showAdvancedFilters = !SubgroupFilterSupport.equals(this.settings.studentFilters, this.aggregateReportOptions.studentFilters);

    this.lowestAvailableSchoolYear = Math.min(...this.filteredOptions.schoolYears.map(schoolYear => schoolYear.value));

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
      assessmentGradeRange: [
        this.settings.longitudinalCohort.assessmentGrades, [
          isGreaterThan(1, { messageId: 'aggregate-report-form.field.assessment-grades-less-than-minimum-error' }),
          withinBounds(this.settings.longitudinalCohort.toSchoolYear,
            this.lowestAvailableSchoolYear,
            { messageId: 'aggregate-report-form.field.assessment-grades-exceed-available-school-years-error' })
        ]
      ],
      toSchoolYear: [ this.settings.longitudinalCohort.toSchoolYear ],
    });
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  getAssessmentDefinition(): AssessmentDefinition {
    return this.assessmentDefinition;
  }

  getNavItems(): ScrollNavItem[] {
    return [ {
      id: 'longitudinalCohortOrganizationSection',
      translationKey: 'aggregate-report-form.section.organization.heading'
    }, {
      id: 'longitudinalCohortAssessmentSection',
      translationKey: 'aggregate-report-form.section.assessment-heading'
    }, {
      id: 'longitudinalCohortSubgroupSection',
      translationKey: 'aggregate-report-form.section.comparative-subgroups-heading'
    }, {
      id: 'longitudinalCohortReviewSection',
      translationKey: 'aggregate-report-form.section.review-heading'
    }, {
      id: 'longitudinalCohortPreviewSection',
      translationKey: 'aggregate-report-form.section.preview-heading'
    } ]
  }

  getSupportedAssessmentTypes(): string[] {
    return ['sum'];
  }

  onAssessmentTypeChange(): void {
    this.assessmentDefinition = this.assessmentDefinitionService.get(this.settings.assessmentType, this.settings.reportType);

    this.updateColumnOrder();
    this.markOrganizationsControlTouched();
    this.onSettingsChange();
  }

  protected capableOfRowEstimation(): boolean {
    return (
      (
        // include state results
        this.includeStateResults
        // or anything include schools or districts
        || !Utils.isNullOrEmpty(this.settings.schools) || !Utils.isNullOrEmpty(this.settings.districts)
      )
      // and has at least one grade
      && !Utils.isNullOrEmpty(this.settings.longitudinalCohort.assessmentGrades)
      // and has at least one schools years
      && this.settings.longitudinalCohort.toSchoolYear > 0
    );
  }

}
