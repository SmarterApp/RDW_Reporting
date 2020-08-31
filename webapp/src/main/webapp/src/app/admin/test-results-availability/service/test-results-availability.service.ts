import { Inject, Injectable, OnInit } from '@angular/core';
import { TestResultAvailability } from '../model/test-result-availability';
import { TestResultAvailabilityFilters } from '../model/test-result-availability-filters';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TranslateDatePipe } from '../../../shared/i18n/translate-date.pipe';
import { AdminServiceRoute } from '../../../shared/service-route';
import {
  DATA_CONTEXT_URL,
  DataService
} from '../../../shared/data/data.service';
import { UserOptions } from '../model/user-options';
import { ResponseContentType } from '@angular/http';
import { EmbargoQueryType } from '../model/embargo-query-type';
import { PageSettingsType } from '../model/page-settings-type';

const ResourceContext = `${AdminServiceRoute}/testResults`;
const ServiceRoute = `${AdminServiceRoute}/embargoes`;

@Injectable({
  providedIn: 'root'
})
export class TestResultsAvailabilityService implements OnInit {
  constructor(
    private dataService: DataService,
    private datePipe: TranslateDatePipe,
    private translate: TranslateService,
    @Inject(DATA_CONTEXT_URL) private contextUrl: string = '/api'
  ) {}

  static readonly FilterIncludeAll = {
    label: 'test-results-availability.all-text',
    value: null
  };

  successfulChange: boolean;

  /**
   * Converts an embargo record from the backend into a typescript object.
   * @param source one record returned from the finder as json
   *
   * @return TestResultAvailability object.
   */
  private static toTestResultAvailability(source: any): TestResultAvailability {
    return {
      schoolYear: { label: '' + source.schoolYear, value: source.schoolYear },
      district: { label: source.districtName, value: source.districtId },
      subject: { label: source.subjectCode, value: source.subjectId },
      reportType: { label: source.reportType, value: source.reportType },
      status: { label: source.status, value: source.status },
      examCount: source.examCount
    };
  }

  /**
   * Converts the filter options returned by the backend for this user into a TypeScript object.
   * @param source the data record returned by the backend as json
   *
   * @return a UserOptions object.
   */
  private static toOptions(source: any): UserOptions {
    const toSubjectKey = label => 'subject.' + label + '.name';
    const toReportTypeKey = label =>
      'test-results-availability.reportType.' + label;
    const toStatusKey = label => 'test-results-availability.status.' + label;

    const statuses = source.statuses.map(stat => {
      return { label: toStatusKey(stat), value: stat };
    });
    statuses.unshift(TestResultsAvailabilityService.FilterIncludeAll);

    const sourceDistricts = source.districts || [];
    const districts = sourceDistricts
      .map(dist => {
        return { label: dist.name, value: dist.id };
      })
      .sort((a, b) => a.label.localeCompare(b.label));

    // Don't give an All option to district admins with only one district.
    if (!(source.districtAdmin && source.districts.length === 1)) {
      districts.unshift(TestResultsAvailabilityService.FilterIncludeAll);
    }

    const schoolYears = source.schoolYears
      .map(year => {
        return { label: year.toString(), value: year };
      })
      .sort((a, b) => b.value - a.value);
    schoolYears.unshift(TestResultsAvailabilityService.FilterIncludeAll);

    const subjects = source.subjects
      .map(sub => {
        return { label: toSubjectKey(sub.code), value: sub.id };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
    subjects.unshift(TestResultsAvailabilityService.FilterIncludeAll);

    const reportTypes = source.reportTypes
      .map(type => {
        return { label: toReportTypeKey(type), value: type };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
    reportTypes.unshift(TestResultsAvailabilityService.FilterIncludeAll);

    return {
      viewAudit: source.viewAudit,
      districtAdmin: source.districtAdmin,
      districts: districts,
      statuses: statuses,
      subjects: subjects,
      schoolYears: schoolYears,
      reportTypes: reportTypes
    };
  }

  ngOnInit(): void {}

  // formatAsLocalDate(date: Date): string {
  //   return this.datePipe.transform(date, 'yyyy-MM-dd');
  // }

  /**
   * Gets one page of test results for the given page settings and filters.
   *
   * @param pageSettings filters, page size and offset, and sort.
   * @param filters currently applied data filters
   */
  getTestResults(
    pageSettings: PageSettingsType,
    filters: TestResultAvailabilityFilters
  ): Observable<TestResultAvailability[]> {
    const query: EmbargoQueryType = {
      pageSize: pageSettings.pageSize,
      rowOffset: pageSettings.offset,
      sortField: pageSettings.sortField,
      descending: pageSettings.descending,
      schoolYear: filters.schoolYear.value,
      subjectId: filters.subject.value,
      reportType: filters.reportType.value,
      districtIds: filters.district.value ? [filters.district.value] : null,
      statuses: filters.status.value ? [filters.status.value] : null
    };

    return this.dataService.post(`${ResourceContext}`, query).pipe(
      map((sourceTestResults: any[]) => {
        return sourceTestResults.map(r =>
          TestResultsAvailabilityService.toTestResultAvailability(r)
        );
      })
    );
  }

  /**
   * Gets total row count for the given filters.
   *
   * @param filters
   */
  getRowCount(filters: TestResultAvailabilityFilters): Observable<number> {
    const query: EmbargoQueryType = {
      pageSize: 0,
      rowOffset: 0,
      schoolYear: filters.schoolYear.value,
      subjectId: filters.subject.value,
      reportType: filters.reportType.value,
      districtIds: filters.district.value ? [filters.district.value] : null,
      statuses: filters.status.value ? [filters.status.value] : null
    };

    return this.dataService.post(`${ResourceContext}/count`, query).pipe(
      map((source: number) => {
        return source;
      })
    );
  }

  /**
   * Gets the options for the filter dropdowns and some user permission settings.
   */
  getUserOptions(): Observable<UserOptions> {
    return this.dataService.get(`${ResourceContext}/filters`).pipe(
      map((sourceUserSettings: any) => {
        return TestResultsAvailabilityService.toOptions(sourceUserSettings);
      })
    );
  }

  /**
   * Download embargo audit report CSV file.
   */
  openReport(): void {
    window.open(`${this.contextUrl}${ServiceRoute}/audit`, '_blank');
  }

  // TODO:  log changes and no need to persist
  changeTestResults(
    testResultFilters: TestResultAvailabilityFilters,
    newStatus: any
  ) {
    console.log('Change Request Log Info:', newStatus, testResultFilters);
    this.successfulChange = false;
    this.logTestResults(testResultFilters, newStatus.value);
    this.successfulChange = true;
  }

  logTestResults(
    testResultFilters: TestResultAvailabilityFilters,
    newStatus: string
  ) {
    const asArray = el => (el === null ? null : [el]);

    this.dataService
      .put(
        `${ResourceContext}`,
        {
          schoolYear: testResultFilters.schoolYear.value,
          districtIds: asArray(testResultFilters.district.value),
          subjectId: testResultFilters.subject.value,
          reportType: testResultFilters.reportType.value,
          status: testResultFilters.status.value,
          newStatus: newStatus
        },
        { responseType: ResponseContentType.Text }
      )
      .pipe()
      .subscribe();
  }
}
