export interface Group {
  readonly id: number;
  readonly name: string;
  readonly schoolName: string;
  readonly schoolId: number;
  readonly districtId?: number;
  readonly subjectCode: string;
  readonly totalStudents?: number;
  readonly userCreated: boolean;
}
