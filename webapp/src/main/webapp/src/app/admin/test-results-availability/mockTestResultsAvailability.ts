import { TestResultAvailability } from './model/test-result-availability';

export class MockTestResultsAvailability {
  // TODO: replace once real data is available
  mockTestResults: TestResultAvailability[] = this.getMockTestResults();

  getMockTestResults(): TestResultAvailability[] {
    return [
      {
        schoolYear: 2020,
        district: 'QA Test District',
        subject: 'Math',
        reportType: 'Individual',
        resultCount: 0,
        status: 'Loading'
      },
      {
        schoolYear: 2020,
        district: 'QA Test District',
        subject: 'Science',
        reportType: 'Aggregate',
        resultCount: 50,
        status: 'Loading'
      },
      {
        schoolYear: 2020,
        district: 'Crom District',
        subject: 'Science',
        reportType: 'Aggregate',
        resultCount: 10560,
        status: 'Reviewing'
      },
      {
        schoolYear: 2019,
        district: 'Magnet District',
        subject: 'ELA',
        reportType: 'Aggregate',
        resultCount: 12834,
        status: 'Reviewing'
      },
      {
        schoolYear: 2019,
        district: 'Alpaca Nunbird District',
        subject: 'ELA',
        reportType: 'Aggregate',
        resultCount: 44893,
        status: 'Released'
      },
      {
        schoolYear: 2019,
        district: 'Alpaca Nunbird District',
        subject: 'ELPAC',
        reportType: 'Aggregate',
        resultCount: 6720,
        status: 'Reviewing'
      },
      {
        schoolYear: 2018,
        district: 'Alpaca Nunbird District',
        subject: 'ELPAC',
        reportType: 'Aggregate',
        resultCount: 9021,
        status: 'Released'
      },
      {
        schoolYear: 2020,
        district: 'Magnet District',
        subject: 'ELPAC',
        reportType: 'Aggregate',
        resultCount: 23528,
        status: 'Reviewing'
      },
      {
        schoolYear: 2018,
        district: 'Igen District',
        subject: 'Science',
        reportType: 'Individual',
        resultCount: 7032,
        status: 'Released'
      },
      {
        schoolYear: 2019,
        district: 'Magnet District',
        subject: 'ELA',
        reportType: 'Individual',
        resultCount: 9205,
        status: 'Released'
      },
      {
        schoolYear: 2018,
        district: 'Igen District',
        subject: 'Math',
        reportType: 'Aggregate',
        resultCount: 80214,
        status: 'Released'
      },
      {
        schoolYear: 2020,
        district: 'Magnet District',
        subject: 'Math',
        reportType: 'Individual',
        resultCount: 0,
        status: 'Loading'
      },
      {
        schoolYear: 2020,
        district: 'Magnet District',
        subject: 'Math',
        reportType: 'Aggregate',
        resultCount: 9811,
        status: 'Reviewing'
      },
      {
        schoolYear: 2020,
        district: 'QA Test District',
        subject: 'ELA',
        reportType: 'Individual',
        resultCount: 85546,
        status: 'Loading'
      },
      {
        schoolYear: 2020,
        district: 'QA Test District',
        subject: 'Science',
        reportType: 'Individual',
        resultCount: 3029,
        status: 'Released'
      },
      {
        schoolYear: 2020,
        district: 'QA Test District',
        subject: 'Math',
        reportType: 'Aggregate',
        resultCount: 8765,
        status: 'Released'
      },
      {
        schoolYear: 2020,
        district: 'Alpaca Nunbird District',
        subject: 'Science',
        reportType: 'Aggregate',
        resultCount: 8514,
        status: 'Reviewing'
      },
      {
        schoolYear: 2020,
        district: 'Alpaca Nunbird District',
        subject: 'Math',
        reportType: 'Aggregate',
        resultCount: 214,
        status: 'Loading'
      },
      {
        schoolYear: 2020,
        district: 'Alpaca Nunbird District',
        subject: 'Math',
        reportType: 'Individual',
        resultCount: 467,
        status: 'Loading'
      },
      {
        schoolYear: 2020,
        district: 'Igen District',
        subject: 'Math',
        reportType: 'Aggregate',
        resultCount: 2031,
        status: 'Reviewing'
      },
      {
        schoolYear: 2020,
        district: 'Igen District',
        subject: 'ELA',
        reportType: 'Aggregate',
        resultCount: 6721,
        status: 'Released'
      },
      {
        schoolYear: 2020,
        district: 'Igen District',
        subject: 'Science',
        reportType: 'Aggregate',
        resultCount: 0,
        status: 'Loading'
      }
    ];
  }

  // TODO: Make sure Filter options are obtained from REAL initial test results availability
  getTestResultsSchoolYearOptions(): number[] {
    return this.mockTestResults
      .map(a => a.schoolYear)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => b - a);
  }

  getTestResultsDistrictOptions(): string[] {
    return this.mockTestResults
      .map(a => a.district)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }

  getTestResultsSubjectOptions(): string[] {
    return this.mockTestResults
      .map(a => a.subject)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }

  getTestResultsReportTypeOptions(): string[] {
    return this.mockTestResults
      .map(a => a.reportType)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }
}
