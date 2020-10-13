export interface EmbargoQueryType {
  readonly schoolYear?: number;
  readonly subjectId?: number;
  readonly reportType?: string;
  readonly districtIds?: number[];
  readonly statuses?: string[];
  readonly sortField?: string;
  readonly descending?: boolean;
  readonly pageSize: number;
  readonly rowOffset: number;
}
