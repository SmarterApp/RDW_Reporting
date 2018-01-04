import { Component } from "@angular/core";
import { QueryBuilderFilterOptions } from "./query-builder-filter-options.model";
import { QueryBuilderFilterBy } from "./query-builder-filterby.model";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { OrganizationType } from "../../organization-export/organization/organization-type.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { UserOrganizations } from "../../organization-export/organization/user-organizations";
import { Organization } from "../../organization-export/organization/organization";
import { OrganizationMapper } from "../../organization-export/organization/organization.mapper";
import { Tree } from "../../organization-export/organization/tree";
import { Option } from "../../shared/form/sb-typeahead.component";

@Component({
  selector: 'query-builder',
  templateUrl: './query-builder.component.html',
})
export class QueryBuilderComponent {

  private readonly ICA: AssessmentType = AssessmentType.ICA;

  filterBy: QueryBuilderFilterBy;

  filterOptions: QueryBuilderFilterOptions = new QueryBuilderFilterOptions();

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
    return "labels.groups.results.adv-filters.";
  }

  constructor(private filterOptionService: ExamFilterOptionsService,
              private router: Router,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private mapper: OrganizationMapper) {
    this.filterBy = new QueryBuilderFilterBy()
  }

  ngOnInit() {
    this.filterOptionService.getExamFilterOptions().subscribe((filterOptions: QueryBuilderFilterOptions) => {
      this.filterOptions = filterOptions;
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
}
