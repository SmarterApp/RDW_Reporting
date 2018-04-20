import { Injectable } from '@angular/core';
import { AssessmentExamMapper } from '../assessments/assessment-exam.mapper';
import { DetailsByPerformanceLevel, MeasuredAssessment } from './measured-assessment';

@Injectable()
export class MeasuredAssessmentMapper {

  constructor(private assessmentExamMapper: AssessmentExamMapper) {
  }

  mapMeasuredAssessmentsFromApi(serverAssessments: any[]): MeasuredAssessment[] {
    return serverAssessments
      .map(serverAssessment => this.mapMeasuredAssessmentFromApi(serverAssessment));
  }

  mapMeasuredAssessmentFromApi(serverAssessment: any): MeasuredAssessment {
    return <MeasuredAssessment>{
      assessment: this.assessmentExamMapper.mapAssessmentFromApi(serverAssessment.assessment),
      averageScaleScore: serverAssessment.measures.avgScaleScore,
      averageStandardError: serverAssessment.measures.avgStdErr,
      date: serverAssessment.completedAt,
      studentsTested: serverAssessment.studentsTested,
      studentCountByPerformanceLevel: [
        this.mapDetailedPerformanceLevel(serverAssessment.measures.level1Count, serverAssessment),
        this.mapDetailedPerformanceLevel(serverAssessment.measures.level2Count, serverAssessment),
        this.mapDetailedPerformanceLevel(serverAssessment.measures.level3Count, serverAssessment)
      ]
    };
  }

  mapDetailedPerformanceLevel(studentCount: number, serverAssessment: any): DetailsByPerformanceLevel {
    return <DetailsByPerformanceLevel>{
      studentCount: studentCount,
      percent: (studentCount / serverAssessment.studentsTested) * 100
    };
  }
}
