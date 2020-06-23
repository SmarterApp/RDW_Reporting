import { Injectable, OnInit } from '@angular/core';
import { TestResultAvailability } from '../model/test-result-availability';
import { TestResultAvailabilityFilters } from '../model/test-result-availability-filters';
import { MockTestResultsAvailability } from '../mockTestResultsAvailability';

@Injectable({
  providedIn: 'root'
})
export class TestResultsAvailabilityService implements OnInit {
  private testResultFilters: TestResultAvailabilityFilters = new TestResultAvailabilityFilters();
  private defaultTestResultFilters = new TestResultAvailabilityFilters();
  private mockTestResults = new MockTestResultsAvailability();

  // TODO: optimize maybe condense to one
  private allDefault = 'All';
  statusDefault: string = this.allDefault;
  schoolYearsDefault: any = this.allDefault;
  successfulChange: boolean;

  //  TODO: update. Below determine what to display depending on session
  //   and user change to see the different Test Results Configurations
  private districtAdmin = false; // set from User's permissions
  private devOps = true; // set from User's permissions
  private sandbox = false; // set from session info
  private adminDistrict = 'District 12'; // default district for districtAdmin

  ngOnInit(): void {
    this.setTestResultFilterDefaults();
    this.testResultFilters = this.getTestResultAvailabilityFilterDefaults();
  }

  // receive test results and apply filter's options
  getTestResults(
    testResultFilters: TestResultAvailabilityFilters
  ): TestResultAvailability[] {
    // TODO: replace with real data
    let testResults = this.mockTestResults.getMockTestResults().sort((a, b) => {
      return b.schoolYear - a.schoolYear;
    });

    if (this.validateTestResultsFilterAreDefault(testResultFilters)) {
      return testResults;
    }

    return testResults.filter(tr =>
      this.applyTestResultsFilter(tr, testResultFilters)
    );
  }

  // TODO:  log changes and no need to persist
  changeTestResults(
    testResultFilters: TestResultAvailabilityFilters,
    newStatus: string
  ) {
    this.successfulChange = false;
    this.testResultFilters.status = newStatus;
    this.logTestResults(testResultFilters);
    this.successfulChange = true; // comment out to test error
  }

  // TODO: add save of data
  logTestResults(testResultFilters: TestResultAvailabilityFilters) {
    console.log('Change Request Log Info:' + JSON.stringify(testResultFilters));
    // covert to csv for test
  }

  setTestResultFilterDefaults() {
    this.defaultTestResultFilters.schoolYear = this.schoolYearsDefault;
    this.defaultTestResultFilters.district = this.allDefault; // TODO: set from session if District Admin
    this.defaultTestResultFilters.subject = this.allDefault;
    this.defaultTestResultFilters.state = 'California'; // TODO: Get from session
    this.defaultTestResultFilters.reportType = this.allDefault;
    this.defaultTestResultFilters.status = this.statusDefault;
  }

  getTestResultAvailabilityFilterDefaults(): TestResultAvailabilityFilters {
    return this.defaultTestResultFilters;
  }

  private applyTestResultsFilter(
    testResult: TestResultAvailability,
    testResultFilters: TestResultAvailabilityFilters
  ) {
    // may need to adjust order
    if (this.filterStatus(testResultFilters.status, testResult.status)) {
      return false;
    }
    if (
      this.filterReportType(testResultFilters.reportType, testResult.reportType)
    ) {
      return false;
    }
    if (this.filterSubject(testResultFilters.subject, testResult.subject)) {
      return false;
    }
    if (this.filterDistrict(testResultFilters.district, testResult.district)) {
      return false;
    }
    if (
      this.filterSchoolYear(testResultFilters.schoolYear, testResult.schoolYear)
    ) {
      return false;
    }
    return true;
  }

  private filterStatus(filteredStatus: string, status: string): boolean {
    return filteredStatus != this.statusDefault && filteredStatus != status;
  }

  private filterReportType(
    filteredReportType: string,
    reportType: string
  ): boolean {
    return (
      filteredReportType != this.allDefault && filteredReportType != reportType
    );
  }
  private filterSubject(filteredSubject: string, subject: string): boolean {
    return filteredSubject != this.allDefault && filteredSubject != subject;
  }

  private filterDistrict(filteredDistrict: string, district: string): boolean {
    return filteredDistrict != this.allDefault && filteredDistrict != district;
  }

  private filterSchoolYear(
    filteredSchoolYear: number,
    schoolYear: number
  ): boolean {
    return (
      filteredSchoolYear != this.schoolYearsDefault &&
      filteredSchoolYear != schoolYear
    );
  }

  isDistrictAdmin(): boolean {
    return this.districtAdmin;
  }

  isDevOps(): boolean {
    return this.devOps;
  }

  isSandbox(): boolean {
    return this.sandbox;
  }

  generateAuditHistory() {
    // determine what can be returned
  }

  validateTestResultsFilterAreDefault(
    testResultFilters: TestResultAvailabilityFilters
  ) {
    if (
      this.statusDefault == testResultFilters.status &&
      this.allDefault == testResultFilters.reportType &&
      this.allDefault == testResultFilters.subject &&
      this.allDefault == testResultFilters.district &&
      this.schoolYearsDefault == testResultFilters.schoolYear
    ) {
      return true;
    }
    return false;
  }

  getAdminUserDistrict() {
    return this.adminDistrict;
  }

  getTestResultsStatusOptions(): string[] {
    // Loading only available for DevOps permission
    if (this.isDevOps()) {
      return ['Loading', 'Reviewing', 'Released'];
    }
    return ['Reviewing', 'Released'];
  }

  // Filter options are obtained from initial test results availability
  getTestResultsSchoolYearOptions(): number[] {
    // return [2020, 2019, 2018];
    return this.mockTestResults.getTestResultsSchoolYearOptions();
  }

  getTestResultsDistrictOptions(): string[] {
    return this.mockTestResults.getTestResultsDistrictOptions();
  }

  getTestResultsSubjectOptions(): string[] {
    return this.mockTestResults.getTestResultsSubjectOptions();
  }

  getTestResultsReportTypeOptions(): string[] {
    return this.mockTestResults.getTestResultsReportTypeOptions();
  }
}
