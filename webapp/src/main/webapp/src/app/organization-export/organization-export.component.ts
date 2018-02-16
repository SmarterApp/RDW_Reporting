import { Component, OnInit } from "@angular/core";
import { OrganizationType } from "./organization/organization-type.enum";
import { TranslateService } from "@ngx-translate/core";
import { Tree } from "./organization/tree";
import { Organization } from "./organization/organization";
import { OrganizationMapper } from "./organization/organization.mapper";
import { ActivatedRoute, Router } from "@angular/router";
import { ExamFilterOptionsService } from "../assessments/filters/exam-filters/exam-filter-options.service";
import { OrganizationExport, OrganizationExportService } from "./organization-export.service";
import { NotificationService } from "../shared/notification/notification.service";
import { Option } from "../shared/form/sb-typeahead.component";

@Component({
  selector: 'organization-export',
  templateUrl: './organization-export.component.html'
})
export class OrganizationExportComponent implements OnInit {

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
   * The sort order of the organizations
   */
  private _comparator = (a: Organization, b: Organization) => a.name && b.name ? a.name.localeCompare(b.name) : 0;

  public transferAccess: boolean;

  public orgExport: OrganizationExport;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private service: OrganizationExportService,
              private mapper: OrganizationMapper,
              private filterOptionService: ExamFilterOptionsService,
              private notificationService: NotificationService) {
    this.orgExport = {
      schoolYear: undefined,
      disableTransferAccess: false,
      schools: [],
      organizations: undefined
    };
  }

  ngOnInit() {
    this.orgExport.organizations = this.route.snapshot.data[ 'organizations' ];

    // pre-sorted so mapper.option() results don't need to be sorted
    this.orgExport.organizations.schools.sort(this._comparator);

    // create all options and reuse them when calling mapper.option()
    this._organizationOptionsByUuid = new Map<string, Option>(
      this.orgExport.organizations.organizations.map(organization => <any>[
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
    this.selectedSchools = this.orgExport.organizations.schools.length == 1
      ? [ this.orgExport.organizations.schools[ 0 ] ]
      : [];

    // get the available school years
    this.filterOptionService.getExamFilterOptions()
      .subscribe(options => {
        let schoolYears = options.schoolYears;

        // initialize selected school year based on options
        this._schoolYearOptions = schoolYears;
        if (schoolYears.length) {
          this.orgExport.schoolYear = schoolYears[ 0 ];
        }
      });

    //set transfer access
    this.transferAccess = this.route.snapshot.data[ 'user' ].configuration.transferAccess;
  }

  get selectedSchools(): Organization[] {
    return this.orgExport.schools;
  }

  set selectedSchools(value: Organization[]) {
    if (this.orgExport.schools !== value) {

      this.orgExport.schools = value;

      this._unselectedSchools = this.orgExport.organizations.schools
        .filter(organization => !value.some(x => x.id === organization.id));

      // restrict allowed additions to one createDistrict maximum
      let districtRestrictedUnselectedOrganizations = this.orgExport.schools.length == 0
        ? this._unselectedSchools
        : this._unselectedSchools.filter(x => x.districtId === this.orgExport.schools[ 0 ].districtId);

      // recompute the options available in the search select
      this._organizationOptions = this.mapper
        .createOptions(districtRestrictedUnselectedOrganizations, this._organizationOptionsByUuid);

      // recompute the organizations in the tree
      this._organizationTree = this.mapper
        .createOrganizationTreeWithPlaceholders(value, this.orgExport.organizations)
        .sort(this._comparator);
    }
  }

  get selectedAll(): boolean {
    return this.orgExport.organizations.schools.length === this.orgExport.schools.length;
  }

  get organizationOptions(): Option[] {
    return this._organizationOptions;
  }

  get organizationTree(): Tree<Organization> {
    return this._organizationTree;
  }

  get selectAllEnabled(): boolean {
    return this.orgExport.organizations.districts.length < 2;
  }

  get editingDisabled(): boolean {
    return this.orgExport.organizations.schools.length <= 1;
  }

  get schoolYearOptions(): number[] {
    return this._schoolYearOptions;
  }

  add(organization: Organization): void {
    this.selectedSchools = [
      ...this.orgExport.schools,
      ...this._unselectedSchools.filter(unselected => organization.isOrIsAncestorOf(unselected))
    ];
  }

  addAll(): void {
    this.selectedSchools = this.orgExport.organizations.schools;
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
    this.orgExport.name = this.orgExport.name || this.translate.instant('labels.organization-export.form.default-report-name');

    this.service.createExport(this.orgExport)
      .subscribe(
        () => {
          this.notificationService.info({ id: 'labels.organization-export.form.submit.success-html', html: true });
          this.router.navigate([ '/reports' ]);
        },
        () => this.notificationService.error({ id: 'labels.organization-export.form.submit.failure' })
      );
  }

}
