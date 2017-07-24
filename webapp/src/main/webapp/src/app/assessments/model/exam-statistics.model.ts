export class ExamStatistics {
  total: number;
  average: number;
  standardError: number;
  levels: ExamStatisticsLevel[];
  percents: ExamStatisticsLevel[];
}

export class ExamStatisticsLevel {
  id: number;
  value: number;
  suffix: string;
}
