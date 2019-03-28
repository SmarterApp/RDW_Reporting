/**
 * Represents a report generated by the user at some point in time
 * This model serves as a handle on a persisted report that can be downloaded,
 * or report request that can be reissued to regenerate a historic report for download again
 */

export class Report {

  id: number;
  label: string;
  status: string;
  reportType: string;
  assessmentTypeCode: string;
  subjectCodes: string[];
  schoolYears: number[];
  created: Date;
  request: any;
  metadata: {[key: string]: string};

  get completed(): boolean {
    return this.status === 'COMPLETED';
  }

  get empty(): boolean {
    return this.status === 'NO_RESULTS';
  }

  get processing(): boolean {
    return this.status === 'PENDING' || this.status === 'RUNNING';
  }

  get regenerable(): boolean {
    return !(this.completed || this.processing);
  }

  get statusColor(): string {
    if (this.completed) {
      return 'blue-dark';
    }
    if (this.processing) {
      return 'aqua';
    }
    return 'maroon';
  }

}