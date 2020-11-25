import {
  Component,
  DoCheck,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { TestResultAvailability } from './model/test-result-availability';
import { TestResultsAvailabilityService } from './service/test-results-availability.service';
import { TestResultAvailabilityFilters } from './model/test-result-availability-filters';
import { TestResultsAvailabilityChangeStatusModal } from './test-results-availability-change-status.modal';
import { UserService } from '../../shared/security/service/user.service';
import { map, mergeMap } from 'rxjs/operators';
import { UserOptions } from './model/user-options';
import { Option } from '../../shared/form/sb-typeahead.component';
import { Observable } from 'rxjs';
import { District, School } from '../../shared/organization/organization';
import { DistrictTypeahead } from '../../shared/district/district-typeahead';
import { limit } from '../../school-grade/limit';

class Column {
  id: string; // en.json name
  field: string; // field name used for sorting and styles
  sortable: boolean;

  constructor({ id, field = '', sortable = true }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortable = sortable;
  }
}

@Component({
  selector: 'test-results',
  templateUrl: './test-results-availability.component.html'
})
export class TestResultsAvailabilityComponent implements OnInit, DoCheck {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private testResultsService: TestResultsAvailabilityService,
    private translate: TranslateService,
    private userService: UserService
  ) {}

  @ViewChild('alertSuccess')
  alertSuccess: ElementRef;

  @ViewChild('alertFailure')
  alertFailure: ElementRef;

  @ViewChild('districtTypeahead')
  districtTypeahead: DistrictTypeahead;

  private grabFocusToAlert = false;

  // Table page and sort data
  pageSettings = {
    offset: 0,
    sortField: 'default',
    descending: false,
    pageSize: 20
  };

  // Page loading flag. (Starts true to ovoid a timing issue that caused a misleading console error.)
  loading = true;

  // Total row count based on filters
  rowCount = 0;

  // Current filter settings.
  testResultAvailabilityFilters: TestResultAvailabilityFilters;

  columns: Column[] = [
    new Column({ id: 'school-year', field: 'schoolYear' }),
    new Column({ id: 'district', field: 'district' }),
    new Column({ id: 'subject', field: 'subject' }),
    new Column({ id: 'report-type', field: 'reportType' }),
    new Column({ id: 'result-count', field: 'examCount', sortable: false }),
    new Column({ id: 'status' })
  ];

  changeResultsTooltip = `${this.translate.instant(
    'test-results-availability.change-results-tooltip'
  )}`;

  filteredTestResults: TestResultAvailability[];
  displayData: any[];

  state: string; // state of tenant or sandbox logged into

  // results of change request
  successfulChange: boolean;
  failedChange: boolean;
  changeMessage: string;

  // Filter options for the dropdowns based on user permissions.
  userOptions: UserOptions;

  districtOptions: Option[] | Observable<District[]>;

  private toSubjectKey = label => 'subject.' + label + '.name';
  private toReportTypeKey = label =>
    'test-results-availability.reportType.' + label;
  private toStatusKey = label => 'test-results-availability.status.' + label;

  openChangeResultsModal() {
    const selectedStatus = this.testResultAvailabilityFilters.status;
    if (selectedStatus === TestResultsAvailabilityService.FilterIncludeAll) {
      // Illegal state that should have been prevented by UI.
      console.warn('invalid state: must select a status before Change Status');
      return;
    }

    // Remove "All" from the allowable transition-to options
    const statusOptions = this.userOptions.statuses.filter(
      stat => stat !== TestResultsAvailabilityService.FilterIncludeAll
    );

    const index = statusOptions.indexOf(selectedStatus);
    if (index < 0) {
      console.warn('invalid state: unknown status selected');
    }
    const isLast = index + 1 === statusOptions.length;
    if (index === 0 && isLast) {
      console.warn('invalid state: no status options to change to');
      return;
    }

    // Set default for next status to the one after the selected, or one before if selected is last.
    const defaultNextStatus = isLast
      ? statusOptions[index - 1]
      : statusOptions[index + 1];

    // Remove selected from the allowable transition-to options
    statusOptions.splice(index, 1);

    this.userService
      .getUser()
      .pipe(map(user => user.sandboxUser))
      .subscribe(sandboxUser => {
        // Initial state for modal (modal class must contain matching fields)
        const initialState = {
          sandboxUser: sandboxUser,
          selectedFilters: this.testResultAvailabilityFilters,
          statusOptions: statusOptions,
          selectedStatus: defaultNextStatus
        };

        const modalReference: BsModalRef = this.modalService.show(
          TestResultsAvailabilityChangeStatusModal,
          { initialState }
        );

        modalReference.content.changeStatusEvent.subscribe(res => {
          this.changeMessage = res.message;
          if (res.successful) {
            this.alertFailure = null;
            this.successfulChange = true;
            this.testResultAvailabilityFilters.status = res.status;

            // This needs a slight delay to work properly
            setTimeout(() => {
              this.updateFilters();
            }, 1000);
          } else {
            this.alertSuccess = null;
            this.failedChange = true;
          }
        });
      });
  }

  ngOnInit() {
    this.userService
      .getUser()
      .pipe(map(user => user.tenantName))
      .subscribe(tenantName => {
        this.state = tenantName;
      });

    this.testResultsService.getUserOptions().subscribe(userOptions => {
      this.userOptions = userOptions;
      this.testResultAvailabilityFilters = this.initializeFilterSettings(
        userOptions
      );
      this.refreshRowCount();
    });
  }

  private updateTestResultsData() {
    this.loading = true;

    this.testResultsService
      .getTestResults(this.pageSettings, this.testResultAvailabilityFilters)
      .subscribe(results => {
        this.filteredTestResults = results;
        this.displayData = this.filteredTestResults.map(result =>
          this.toDisplayValues(result)
        );

        this.loading = false;
      });
  }

  private resolveSortField(sortField: string, sortOrder: number): string {
    if (!sortOrder || !sortField || sortField === 'default') {
      return null;
    }

    switch (sortField) {
      case 'district':
        return 'district_name';
      case 'subject':
        return 'subject_code';
      case 'schoolYear':
        return 'school_year';
      case 'reportType':
        return 'report_type';
      default:
        return sortField;
    }
  }

  private toDisplayValues(result: TestResultAvailability) {
    return {
      schoolYear: result.schoolYear.label,
      district: result.district.label,
      subject: this.translate.instant(this.toSubjectKey(result.subject.label)),
      status: this.translate.instant(this.toStatusKey(result.status.label)),
      reportType: this.translate.instant(
        this.toReportTypeKey(result.reportType.label)
      ),
      examCount: result.examCount,
      statusValue: result.status.value
    };
  }

  private refreshRowCount() {
    this.testResultsService
      .getRowCount(this.testResultAvailabilityFilters)
      .subscribe(count => {
        this.rowCount = count;
      });
  }

  private updateFilters() {
    this.refreshRowCount();
    this.pageSettings.offset = 0;
    this.updateTestResultsData();
  }

  /**
   * Event handler for a change to the results table that requires a data refresh.
   * The handled events are navigation to a new page and change to sort.
   *
   * @param $event the table event object with page offset and sort information.
   */
  resultsTablePageChange($event) {
    this.pageSettings.sortField = this.resolveSortField(
      $event.sortField,
      $event.sortOrder
    );
    this.pageSettings.descending = !!($event.sortOrder && $event.sortOrder < 0);
    this.pageSettings.offset = $event.first;

    this.updateTestResultsData();
  }

  //
  //  Filter change handlers.
  //
  onChangeSchoolYearFilter(schoolYear: any) {
    this.testResultAvailabilityFilters.schoolYear = schoolYear;
    this.updateFilters();
  }

  onChangeDistrictFilter(district: any) {
    this.testResultAvailabilityFilters.district = district;
    this.updateFilters();
  }

  deselectDistrict(event: Event) {
    const value = this.districtTypeahead.value;
    if (!value || value.trim()) {
      this.onChangeDistrictFilter(
        TestResultsAvailabilityService.FilterIncludeAll
      );
    }
  }

  onChangeSubjectFilter(subject: any) {
    this.testResultAvailabilityFilters.subject = subject;
    this.updateFilters();
  }

  onChangeReportTypeFilter(reportType: any) {
    this.testResultAvailabilityFilters.reportType = reportType;
    this.updateFilters();
  }

  onChangeStatusFilter(status: any) {
    this.testResultAvailabilityFilters.status = status;
    this.updateFilters();
  }

  testResultsRowStyleClass(rowData: any) {
    return rowData.statusValue === 'Loading'
      ? 'loadingColor'
      : rowData.statusValue === 'Reviewing'
      ? 'reviewingColor'
      : 'releasedColor';
  }

  /**
   * Downlaod the audit log CSV file.
   */
  downloadAuditFile(): void {
    this.testResultsService.openReport();
  }

  closeSuccessAlert() {
    this.successfulChange = false;
    this.changeMessage = null;
  }

  closeErrorAlert() {
    this.failedChange = false;
    this.changeMessage = null;
  }

  ngDoCheck(): void {
    /* tslint:disable */
    // TODO: upgrade to newer version of PrimeNG and then remove this.
    // Hack to label the pagination controls, which the version of p-table we are using doesn't support.
    eval(
      "jQuery('a.ui-paginator-first').attr('aria-label', 'Go to first page')"
    );
    eval(
      "jQuery('a.ui-paginator-prev').attr('aria-label', 'Go to previous page')"
    );
    eval("jQuery('a.ui-paginator-next').attr('aria-label', 'Go to next page')");
    eval("jQuery('a.ui-paginator-last').attr('aria-label', 'Go to last page')");

    // New T-Base recommendation to add "Page" to the page number for screen readers. Not sure if even the new PrimeNG
    // will support this.
    eval(
      "jQuery('a.ui-paginator-page').each(function( index ) { $( this ).attr('aria-label', 'Page ' + (index+1) );});"
    );

    // Change focus to alert when it first appears.
    // Seems like a kludge. Is there a more elegant way to fit it into the lifecycle?
    if (this.alertSuccess && this.grabFocusToAlert) {
      this.alertSuccess.nativeElement.focus();
      this.grabFocusToAlert = false;
    } else if (this.alertFailure && this.grabFocusToAlert) {
      this.alertFailure.nativeElement.focus();
      this.grabFocusToAlert = false;
    }
    /* tslint:enable */
  }

  // Set initial default values for filters.
  private initializeFilterSettings(
    userOptions: UserOptions
  ): TestResultAvailabilityFilters {
    const filters = new TestResultAvailabilityFilters();
    filters.schoolYear = userOptions.schoolYears[1];

    // For most fields, set the default filter to All.
    ['status', 'reportType', 'district', 'schoolYear', 'subject'].forEach(
      field => {
        filters[field] = TestResultsAvailabilityService.FilterIncludeAll;
      }
    );

    // For the case of a district admin with exactly one district, set that district
    // to be the filter selection.
    if (userOptions.districtAdmin && userOptions.districts.length === 1) {
      filters.district = userOptions.districts[0];
    }

    // For school years and subjects, set default to first filter after "Select All" if there is one.
    if (userOptions.schoolYears.length > 1) {
      filters.schoolYear = userOptions.schoolYears[1];
    }
    if (userOptions.subjects.length > 1) {
      filters.subject = userOptions.subjects[1];
    }

    if (userOptions.districts.length === 1) {
      this.loadDistrictOptions();
    }

    return filters;
  }

  private loadDistrictOptions(): void {
    this.districtOptions = Observable.create(observer => {
      observer.next(this.districtTypeahead.value);
    }).pipe(
      mergeMap((search: string) =>
        this.testResultsService.getDistrictFiltersByName(search).pipe()
      )
    );
  }
}
