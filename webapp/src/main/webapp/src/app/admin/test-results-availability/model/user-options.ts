export interface UserOptions {
  viewAudit: boolean;
  districtAdmin: boolean;
  districts: { label: string; value: number }[];
  subjects: { label: string; value: number }[];
  statuses: { label: string; value: string }[];
  schoolYears: { label: string; value: number }[];
  reportTypes: { label: string; value: string }[];
}
