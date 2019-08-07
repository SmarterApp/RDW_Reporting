import { ExamStatisticsLevel } from './exam-statistics.model';

export class ClaimScore {
  level: number;
  standardError?: number;
  score: number;
}

export class ClaimStatistics {
  id: number;
  levels: ExamStatisticsLevel[];
  percents: ExamStatisticsLevel[];
}

