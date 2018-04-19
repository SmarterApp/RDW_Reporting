export interface Group {
  readonly id: number;
  readonly name: string;
  readonly schoolName: string;
  readonly schoolId: number;
  readonly subjectCode: string;
  readonly totalStudentCount?: number;
}
