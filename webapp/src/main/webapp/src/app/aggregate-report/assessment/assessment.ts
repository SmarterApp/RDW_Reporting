export interface Assessment {

  readonly id: number;
  readonly name: string;
  readonly label: string;
  readonly type: string;
  readonly subject: string;
  readonly grade: string;
  readonly gradeSequence: number;
  readonly schoolYear: number;
  readonly cutPoints: number[];

}
