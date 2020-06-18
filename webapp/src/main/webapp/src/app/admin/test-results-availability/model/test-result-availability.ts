export interface TestResultAvailability {
  readonly schoolYear: number;
  readonly district: string;
  readonly subject: string;
  readonly reportType: string;
  readonly resultCount?: number;
  readonly status: string;
}
