import { Component, OnInit } from "@angular/core";
import { OrganizationType } from "./organization/organization-type.enum";
import { TranslateService } from "@ngx-translate/core";
import { Tree } from "./organization/tree";
import { Organization } from "./organization/organization";
import { OrganizationMapper } from "./organization/organization.mapper";
import { ActivatedRoute, Router } from "@angular/router";
import { UserOrganizations } from "./organization/user-organizations";
import { ExamFilterOptionsService } from "../assessments/filters/exam-filters/exam-filter-options.service";
import { OrganizationExportService } from "./organization-export.service";
import { NotificationService } from "../shared/notification/notification.service";
import { Option } from "../shared/form/sb-typeahead.component";

@Component({
  selector: 'organization-export',
  templateUrl: './organization-export.component.html'
})
export class OrganizationExportComponent implements OnInit {

  /**
   * All organizations
   */
  private _organizations: UserOrganizations;

  /**
   * All selected schools
   */
  private _selectedSchools: Organization[];

  /**
   * All unselected organizations
   */
  private _unselectedSchools: Organization[];

  /**
   * Organization options by UUID. This collection is used so that the option models can be created once and reused as needed.
   */
  private _organizationOptionsByUuid: Map<string, Option>;

  /**
   * Organization option view models computed from schools
   */
  private _organizationOptions: Option[];

  /**
   * Organization view model computed from schools
   */
  private _organizationTree: Tree<Organization>;

  /**
   * Available school year options
   */
  private _schoolYearOptions: number[];

  /**
   * Currently selected school year
   */
  private _selectedSchoolYear: number;

  /**
   * The sort order of the organizations
   */
  private _comparator = (a: Organization, b: Organization) => a.name && b.name ? a.name.localeCompare(b.name) : 0;

  public transferAccess: boolean;

  public disableTransferAccess: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private service: OrganizationExportService,
              private mapper: OrganizationMapper,
              private filterOptionService: ExamFilterOptionsService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this._organizations = this.route.snapshot.data[ 'organizations' ];

    // pre-sorted so mapper.option() results don't need to be sorted
    this._organizations.schools.sort(this._comparator);

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

    // get the available school years
    this.filterOptionService.getExamFilterOptions()
      .subscribe(options => {
        let schoolYears = options.schoolYears;

        // initialize selected school year based on options
        this._schoolYearOptions = schoolYears;
        if (schoolYears.length) {
          this._selectedSchoolYear = schoolYears[ 0 ];
        }
      });

    //set transfer access
    this.transferAccess = this.route.snapshot.data[ 'user' ].configuration.transferAccess;
  }

  get organizations(): UserOrganizations {
    return this._organizations;
  }

  get selectedSchools(): Organization[] {
    return this._selectedSchools;
  }

  set selectedSchools(value: Organization[]) {
    if (this._selectedSchools !== value) {

      this._selectedSchools = value;

      this._unselectedSchools = this._organizations.schools
        .filter(organization => !value.some(x => x.id === organization.id));

      // restrict allowed additions to one createDistrict maximum
      let districtRestrictedUnselectedOrganizations = this._selectedSchools.length == 0
        ? this._unselectedSchools
        : this._unselectedSchools.filter(x => x.districtId === this._selectedSchools[ 0 ].districtId);

      // recompute the options available in the search select
      this._organizationOptions = this.mapper
        .createOptions(districtRestrictedUnselectedOrganizations, this._organizationOptionsByUuid);

      // recompute the organizations in the tree
      this._organizationTree = this.mapper
        .createOrganizationTreeWithPlaceholders(value, this._organizations)
        .sort(this._comparator);
    }
  }

  get selectedAll(): boolean {
    return this._organizations.schools.length === this._selectedSchools.length;
  }

  get organizationOptions(): Option[] {
    return this._organizationOptions;
  }

  get organizationTree(): Tree<Organization> {
    return this._organizationTree;
  }

  get selectAllEnabled(): boolean {
    return this._organizations.districts.length < 2;
  }

  get editingDisabled(): boolean {
    return this._organizations.schools.length <= 1;
  }

  get schoolYearOptions(): number[] {
    return this._schoolYearOptions;
  }

  get selectedSchoolYear(): number {
    return this._selectedSchoolYear;
  }

  set selectedSchoolYear(value: number) {
    this._selectedSchoolYear = value;
  }

  add(organization: Organization): void {
    this.selectedSchools = [
      ...this._selectedSchools,
      ...this._unselectedSchools.filter(unselected => organization.isOrIsAncestorOf(unselected))
    ];
  }

  addAll(): void {
    this.selectedSchools = this._organizations.schools;
  }

  remove(organization: Organization): void {
    this.selectedSchools = this.selectedSchools.filter(selected => !organization.isOrIsAncestorOf(selected));
  }

  removeAll(): void {
    this.selectedSchools = [];
  }

  toggleSelectAll(): void {
    this.selectedAll ? this.removeAll() : this.addAll();
  }

  submit(): void {
    this.service.createExport(this._selectedSchoolYear, this._selectedSchools, this.disableTransferAccess, this._organizations)
      .subscribe(
        () => {
          this.notificationService.info({ id: 'labels.organization-export.form.submit.success-html', html: true });
          this.router.navigate([ '/reports' ]);
        },
        () => this.notificationService.error({ id: 'labels.organization-export.form.submit.failure' })
      );
  }

}
