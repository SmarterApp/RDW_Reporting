import { ClaimStatistics } from './claim-score.model';

export class ExamStatistics {
  total: number;
  average: number;
  standardError: number;
  levels: ExamStatisticsLevel[];
  percents: ExamStatisticsLevel[];

  claims: ClaimStatistics[];
}

export class ExamStatisticsLevel {
  id: number;
  value: number;
  suffix: string;
}
