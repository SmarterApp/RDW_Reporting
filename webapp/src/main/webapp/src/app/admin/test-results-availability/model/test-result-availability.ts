export interface TestResultAvailability {
  readonly district: { label: string; value: number };
  readonly schoolYear: { label: string; value: number };
  readonly subject: { label: string; value: number };
  readonly reportType: { label: string; value: string };
  readonly status: { label: string; value: string };
  readonly examCount?: number;
}
