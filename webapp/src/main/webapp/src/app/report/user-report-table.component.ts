import { Component, Input, TemplateRef } from '@angular/core';
import { UserReport } from './report';
import { getSchoolYears, getSubjectCodes } from './reports';
import { TranslateService } from '@ngx-translate/core';

class Column {
  id: string;
  field: string;
  sortField: string;

  constructor({ id, field, sortField = '' }) {
    this.id = id;
    this.field = field;
    this.sortField = sortField ? sortField : field;
  }
}

interface UserReportTableRow {
  report: UserReport;
  subjectCodes: string[];
  schoolYears: number[];
}

/**
 * Normalizes all query types for display in a table
 * @param report The report to transform
 */
function toUserReportTableRow(report: UserReport): UserReportTableRow {
  const { query } = report;
  return {
    report,
    subjectCodes: getSubjectCodes(query),
    schoolYears: getSchoolYears(query)
  };
}

@Component({
  selector: 'user-report-table',
  templateUrl: './user-report-table.component.html'
})
export class UserReportTableComponent {
  columns: Column[] = [
    new Column({ id: 'name', field: 'report.query.name' }),
    new Column({ id: 'type', field: 'report.query.type' }),
    new Column({
      id: 'assessmentTypes',
      field: 'report.query.assessmentTypeCode'
    }),
    new Column({ id: 'subjects', field: 'subjectCodes' }),
    new Column({ id: 'schoolYears', field: 'schoolYears' }),
    new Column({ id: 'status', field: 'report.status' }),
    new Column({ id: 'created', field: 'report.created' })
  ];
  rows: UserReportTableRow[];

  @Input()
  nameTemplate: TemplateRef<any>;

  @Input()
  set userReports(values: UserReport[]) {
    this.rows = (values || []).map(toUserReportTableRow);
  }

  constructor(private translate: TranslateService) {}

  academicYears(row): string {
    // use prev year of school year to create academic year : example 2019 => 2018-19
    return row.schoolYears
      .map(y => y - 1 + '-' + y.toString().slice(-2))
      .join(',');
  }

  subjectName(row) {
    if (row.subjectCodes.length === 0) {
      return `${this.translate.instant('reports.all')}`;
    }
    return row.subjectCodes.map(
      c => `${this.translate.instant('subject.' + c + '.name')}`
    );
  }
}
