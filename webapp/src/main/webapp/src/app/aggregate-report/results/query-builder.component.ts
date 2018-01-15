import { Component } from "@angular/core";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { OrganizationType } from "../../organization-export/organization/organization-type.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { UserOrganizations } from "../../organization-export/organization/user-organizations";
import { Organization } from "../../organization-export/organization/organization";
import { OrganizationMapper } from "../../organization-export/organization/organization.mapper";
import { Tree } from "../../organization-export/organization/tree";
import { Option } from "../../shared/form/sb-typeahead.component";
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
export class QueryBuilderComponent {

  readonly ICA: AssessmentType = AssessmentType.ICA;

  aggregateReportQuery: AggregateReportQuery = new AggregateReportQuery();

  queryBuilderModel: QueryBuilderModel = new QueryBuilderModel();

  responsePreview: AggregateReportItem[];

  multiSelectOptions: IMultiSelectOption[];
  optionsModel: string[];
  texts: IMultiSelectTexts;
  settings: IMultiSelectSettings = {
    fixedTitle: true,
    maxHeight: null
  };
  /**
   * Organization option view models computed from schools
   */
  private _organizationOptions: Option[];
  /**
   * Organization options by UUID. This collection is used so that the option models can be created once and reused as needed.
   */
  private _organizationOptionsByUuid: Map<string, Option>;
  /**
   * All organizations
   */
  private _organizations: UserOrganizations;

  /**
   * All unselected organizations
   */
  private _unselectedSchools: Organization[];

  /**
   * All selected schools
   */
  private _selectedSchools: Organization[];

  /**
   * The sort order of the organizations
   */
  private _comparator = (a: Organization, b: Organization) => a.name && b.name ? a.name.localeCompare(b.name) : 0;

  /**
   * Organization view model computed from schools
   */
  private _organizationTree: Tree<Organization>;


  get translateRoot() {
    return "labels.filters.";
  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private mapper: OrganizationMapper,
              private reportOptionsService: ReportOptionsService,
              private mockAggregateReportsService: MockAggregateReportsService,
              private schoolYearPipe: SchoolYearPipe) {
    this.aggregateReportQuery.assessmentType = AssessmentType.ICA;
  }

  ngOnInit() {
    this.reportOptionsService.get().subscribe((queryBuilderModel: QueryBuilderModel) => {
      this.queryBuilderModel = queryBuilderModel;
      this.aggregateReportQuery.schoolYears [ this.schoolYearPipe.transform(queryBuilderModel.schoolYears[ 0 ]) ] = true;
    });

    this._organizations = this.route.snapshot.data[ 'organizations' ];

    // pre-sorted so mapper.option() results don't need to be sorted
    // this._organizations.schools.sort(this._comparator);

    // create all options and reuse them when calling mapper.option()
    this._organizationOptionsByUuid = new Map<string, Option>(
      this._organizations.organizations.map(organization => <any>[
          organization.uuid,
          {
            label: organization.name,
            group: this.translate.instant(`labels.organization-export.form.organization.type.${OrganizationType[ organization.type ]}`),
            value: organization
          }
        ]
      )
    );

    // initialize selected schools based on user organizations
    // if the user only has one school to select, select it for them.
    this.selectedSchools = this._organizations.schools.length == 1
      ? [ this._organizations.schools[ 0 ] ]
      : [];

    this.multiSelectOptions = [
      { id: 'Gender', name: this.translate.instant('labels.filters.student.gender') },
      { id: 'Ethnicity', name: this.translate.instant('labels.filters.student.ethnicity') },
      { id: 'LimitedEnglishProficiency', name: this.translate.instant('labels.filters.student.limited-english-proficiency') },
      { id: 'MigrantStatus', name: this.translate.instant('labels.filters.student.migrant-status') },
      { id: 'EconomicDisadvantage', name: this.translate.instant('labels.filters.student.economic-disadvantage') },
      { id: 'IEP', name: this.translate.instant('labels.filters.student.iep') },
      { id: '504Plan', name: this.translate.instant('labels.filters.student.504-plan') },

    ];
    this.texts = {
      defaultTitle: this.translate.instant('labels.aggregate-reports.query-builder.filter-results.organize-result-set-well.comparative-subgroups.title')
    };
  }

  get organizationOptions(): Option[] {
    return this._organizationOptions;
  }

  get organizationTree(): Tree<Organization> {
    return this._organizationTree;
  }


  add(organization: Organization): void {
    this.selectedSchools = [
      ...this._selectedSchools,
      ...this._unselectedSchools.filter(unselected => organization.isOrIsAncestorOf(unselected))
    ];
  }

  remove(organization: Organization): void {
    this.selectedSchools = this.selectedSchools.filter(selected => !organization.isOrIsAncestorOf(selected));
  }

  get selectedSchools(): Organization[] {
    return this._selectedSchools;
  }

  set selectedSchools(value: Organization[]) {
    if (this._selectedSchools !== value) {

      this._selectedSchools = value;

      this._unselectedSchools = this._organizations.schools
        .filter(organization => !value.some(x => x.id === organization.id));

      // recompute the options available in the search select
      this._organizationOptions = this.mapper
        .createOptions(this._unselectedSchools, this._organizationOptionsByUuid);

      // recompute the organizations in the tree
      this._organizationTree = this.mapper
        .createOrganizationTreeWithPlaceholders(value, this._organizations)
        .sort(this._comparator);
    }
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
      this.responsePreview = []
      this.mockAggregateReportsService.generateQueryBuilderSampleData(this.optionsModel, this.aggregateReportQuery, this.queryBuilderModel).subscribe(next => {
        this.responsePreview = next;
      })
    }, 0);
  }
}
