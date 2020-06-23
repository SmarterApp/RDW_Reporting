import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { TestResultAvailability } from './model/test-result-availability';
import { TestResultsAvailabilityService } from './service/test-results-availability.service';
import { TestResultAvailabilityFilters } from './model/test-result-availability-filters';
import { TestResultsAvailabilityChangeStatusModal } from './test-results-availability-change-status.modal';

class Column {
  id: string; // en.json name
  field: string; // TestResult field
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
export class TestResultsAvailabilityComponent implements OnInit {
  columns: Column[] = [
    new Column({ id: 'school-year', field: 'schoolYear' }),
    new Column({ id: 'district' }),
    new Column({ id: 'subject' }),
    new Column({ id: 'report-type', field: 'reportType' }),
    new Column({ id: 'result-count', field: 'resultCount', sortable: false }),
    new Column({ id: 'status' })
  ];
  private _testResultsAvailability: TestResultAvailability[];

  changeResultsTooltip: string =
    'Change status of selected test results availability (all pages).';
  testResultAvailabilityFilters: TestResultAvailabilityFilters;
  filteredTestResults: TestResultAvailability[];

  // Used to determine what to display
  userDistrict: string; // when it's a district admin
  showDistrictFilter: boolean; // set false if districtAdmin
  showAudit: boolean; // only DevOps has ability
  state: string; // state of tenant or sandbox logged into
  numOfRows: number = 10; // todo set to be configurable

  // results of change request
  successfulChange: boolean;
  unableToChange: boolean;

  // TODO Replace drop downs with real data
  schoolYearOptions: number[];
  districtOptions: string[];
  subjectOptions: string[];
  statusOptions: string[];
  reportTypeOptions: string[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private testResultsService: TestResultsAvailabilityService
  ) {}

  get testResultsAvailability(): TestResultAvailability[] {
    return this._testResultsAvailability;
  }

  set testResultsAvailability(testResults: TestResultAvailability[]) {
    this._testResultsAvailability = testResults;
    this.updateFilteredTestResults();
  }

  openChangeResultsModal() {
    let modalReference: BsModalRef = this.modalService.show(
      TestResultsAvailabilityChangeStatusModal,
      {}
    );
    let modal: TestResultsAvailabilityChangeStatusModal =
      modalReference.content;
    modal.selectedFilters = this.testResultAvailabilityFilters;
    modal.statusOptions = this.statusOptions;
    modal.changeStatusEvent.subscribe(res => {
      this.successfulChange = res.data;
      this.unableToChange = res.error;
    });
  }

  ngOnInit() {
    // TODO set from user session
    this.state = 'California';
    this.showDistrictFilter = !this.testResultsService.isDistrictAdmin();
    this.showAudit = this.testResultsService.isDevOps();

    // Data for Drop downs
    this.schoolYearOptions = this.testResultsService.getTestResultsSchoolYearOptions();
    this.districtOptions = this.testResultsService.getTestResultsDistrictOptions();
    // TODO  user session determines if Loading is available (only for DevOps)
    this.subjectOptions = this.testResultsService.getTestResultsSubjectOptions();
    this.reportTypeOptions = this.testResultsService.getTestResultsReportTypeOptions();
    this.statusOptions = this.testResultsService.getTestResultsStatusOptions();

    // set defaults - needed since this component is initialized first
    this.testResultsService.setTestResultFilterDefaults();
    this.testResultAvailabilityFilters = this.testResultsService.getTestResultAvailabilityFilterDefaults();
    if (!this.showDistrictFilter) {
      this.userDistrict = this.testResultsService.getAdminUserDistrict(); //used when user is DistrictAdmin
      this.testResultAvailabilityFilters.district = this.userDistrict;
    }
    this.testResultsAvailability = this.testResultsService.getTestResults(
      this.testResultAvailabilityFilters
    );
    this.filteredTestResults = this.testResultsAvailability;
  }

  // need to save each selected Option to filtered Group
  statusDefault: any = this.testResultsService.statusDefault;

  // need to save each selected Option to filtered Group
  updateFilteredTestResults() {
    this.filteredTestResults = this.testResultsService.getTestResults(
      this.testResultAvailabilityFilters
    );
  }

  onChangeSchoolYearFilter(schoolYear: any) {
    this.testResultAvailabilityFilters.schoolYear = schoolYear;
    this.updateFilteredTestResults();
  }

  onChangeDistrictFilter(district: any) {
    this.testResultAvailabilityFilters.district = district;
    this.updateFilteredTestResults();
  }

  onChangeSubjectFilter(subject: any) {
    this.testResultAvailabilityFilters.subject = subject;
    this.updateFilteredTestResults();
  }

  onChangeReportTypeFilter(reportType: any) {
    this.testResultAvailabilityFilters.reportType = reportType;
    this.updateFilteredTestResults();
  }

  onChangeStatusFilter(status: any) {
    this.testResultAvailabilityFilters.status = status;
    this.updateFilteredTestResults();
  }

  testResultsRowStyleClass(rowData: TestResultAvailability) {
    return rowData.status == 'Loading'
      ? 'loadingColor'
      : rowData.status == 'Reviewing'
      ? 'reviewingColor'
      : 'releasedColor';
  }
  onDownloadAuditFile() {}

  closeSuccessAlert() {
    this.successfulChange = false;
  }

  closeErrorAlert() {
    this.unableToChange = false;
  }
}