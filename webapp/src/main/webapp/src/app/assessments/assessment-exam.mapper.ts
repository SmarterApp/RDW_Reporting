import { Injectable } from '@angular/core';
import { AssessmentExam } from './model/assessment-exam.model';
import { Assessment } from './model/assessment';
import { Exam } from './model/exam';
import { AssessmentItem } from './model/assessment-item.model';
import { ExamItemScore } from './model/exam-item-score.model';
import { ExamTraitScore } from './model/exam-trait-score.model';
import { byGradeThenByName } from './assessment.comparator';
import { ordering } from '@kourge/ordering';
import { byNumber } from '@kourge/ordering/comparator';
import { Student } from '../student/model/student.model';
import { Utils } from '../shared/support/support';
import { DefaultSchool, School } from '../shared/organization/organization';
import { TargetScoreExam } from './model/target-score-exam.model';
import { Target } from './model/target.model';
import { ScaleScore } from '../exam/model/scale-score';

export function toScaleScore(serverScaleScore: any): ScaleScore {
  // server scale scores are nullable
  serverScaleScore = serverScaleScore || {};
  return {
    level: serverScaleScore.level,
    score: serverScaleScore.value,
    standardError: serverScaleScore.standardError
  };
}

export function toExamTraitScore(serverTraitScore: any): ExamTraitScore {
  // server scale scores are nullable
  serverTraitScore = serverTraitScore || {};
  return {
    score: serverTraitScore.score,
    conditionCode: serverTraitScore.conditionCode,
    purpose: serverTraitScore.purpose,
    category: serverTraitScore.category,
    maxScore: serverTraitScore.maxScore
  };
}

export function toAssessment(serverAssessment: any): Assessment {
  return {
    id: serverAssessment.id,
    name: serverAssessment.name,
    label: serverAssessment.label,
    grade: serverAssessment.gradeCode,
    type: serverAssessment.typeCode,
    schoolYear: serverAssessment.schoolYear,
    subject: serverAssessment.subjectCode,
    alternateScoreCodes: serverAssessment.altScoreCodes || [],
    claimCodes: serverAssessment.claimCodes || [],
    cutPoints: serverAssessment.cutPoints || [],
    resourceUrl: serverAssessment.resourceUrl,
    hasWerItem: serverAssessment.werItem,
    targetReportEnabled: serverAssessment.targetReportEnabled
  };
}

function toAssessmentItem(serverItem: any): AssessmentItem {
  const item: AssessmentItem = new AssessmentItem();

  item.id = serverItem.id;
  item.bankItemKey = serverItem.bankItemKey;
  item.position = serverItem.position;
  item.claim = serverItem.claimCode;
  item.targetId = serverItem.targetId;
  item.targetNaturalId = serverItem.targetNaturalId;
  item.depthOfKnowledge = {
    level: serverItem.depthOfKnowledge.level,
    referenceUrl: serverItem.depthOfKnowledge.referenceUrl
  };
  item.mathPractice = serverItem.mathPracticeCode;
  item.allowCalculator = Utils.booleanToPolarEnum(serverItem.allowCalculator);
  item.difficulty = serverItem.difficultyCode;
  item.maxPoints = serverItem.maximumPoints;
  item.commonCoreStandardIds = serverItem.commonCoreStandardIds || [];
  item.type = serverItem.type;
  item.numberOfChoices = serverItem.optionsCount;
  item.performanceTaskWritingType = serverItem.performanceTaskWritingType;

  // only multiple choice and multiple select have valid answer keys, so ignore the others
  item.answerKey =
    serverItem.type === 'MC' || serverItem.type === 'MS'
      ? serverItem.answerKey
      : undefined;

  return item;
}

export function toExam(serverExam: any): Exam {
  const exam: any = {};
  exam.id = serverExam.id;
  exam.date = serverExam.dateTime;
  exam.session = serverExam.sessionId;
  exam.enrolledGrade = serverExam.gradeCode;
  exam.administrativeCondition = serverExam.administrativeConditionCode;
  exam.completeness = serverExam.completenessCode;
  exam.schoolYear = serverExam.schoolYear;
  exam.transfer = serverExam.transfer;
  exam.school = toSchool(serverExam.school);
  exam.alternateScaleScores = (serverExam.altScaleScores || []).map(
    serverScaleScore => toScaleScore(serverScaleScore)
  );
  exam.claimScaleScores = (serverExam.claimScaleScores || []).map(
    serverScaleScore => toScaleScore(serverScaleScore)
  );
  exam.traitScores = (serverExam.traitScores || []).map(serverTraitScore =>
    toExamTraitScore(serverTraitScore)
  );

  if (serverExam.studentContext) {
    const {
      economicDisadvantage,
      migrantStatus,
      section504,
      iep,
      lep,
      elasCode,
      languageCode,
      militaryConnectedCode
    } = serverExam.studentContext;
    exam.migrantStatus = migrantStatus;
    exam.plan504 = section504;
    exam.iep = iep;
    exam.economicDisadvantage = economicDisadvantage;
    exam.limitedEnglishProficiency = lep;
    exam.elasCode = elasCode;
    exam.languageCode = languageCode;
    exam.militaryConnectedCode = militaryConnectedCode;
  }

  if (serverExam.student) {
    exam.student = toStudent(serverExam.student);
  }

  if (serverExam.scaleScore) {
    const { value, level, standardError } = serverExam.scaleScore;
    exam.score = value;
    exam.level = level;
    exam.standardError = standardError;
  }

  exam.accommodationCodes = serverExam.accommodationCodes;

  return exam;
}

function toExamItem(serverExamItem: any): ExamItemScore {
  const examItem: ExamItemScore = new ExamItemScore();
  examItem.examId = serverExamItem.examId;
  examItem.points = serverExamItem.points;
  examItem.position = serverExamItem.position;
  examItem.response = serverExamItem.response;
  examItem.writingTraitScores = serverExamItem.writingTraitScores;
  return examItem;
}

function toStudent(serverStudent: any): Student {
  const student: Student = new Student();
  student.id = serverStudent.id;
  student.ssid = serverStudent.ssid;
  student.firstName = serverStudent.firstName;
  student.lastName = serverStudent.lastName;
  student.genderCode = serverStudent.genderCode;
  student.ethnicityCodes = serverStudent.ethnicityCodes;
  student.militaryConnectedCode = serverStudent.militaryConnectedCodes;
  return student;
}

export function toSchool(serverExamSchool: any): School {
  const school: DefaultSchool = new DefaultSchool();
  school.name = serverExamSchool.name;
  school.id = serverExamSchool.id;
  return school;
}

export function toTarget(serverTarget: any): Target {
  return {
    id: serverTarget.id,
    assessmentId: serverTarget.assessmentId,
    claimCode: serverTarget.claimCode,
    naturalId: serverTarget.naturalId,
    includeInReport: serverTarget.includeInReport
  };
}

export function toTargetScoreExam(serverTargetScoreExam: any): TargetScoreExam {
  return {
    ...toExam(serverTargetScoreExam),
    targetId: serverTargetScoreExam.targetId,
    standardMetRelativeResidualScore:
      serverTargetScoreExam.standardMetRelativeResidualScore,
    studentRelativeResidualScore:
      serverTargetScoreExam.studentRelativeResidualScore
  };
}

export function toAssessmentExam(serverAssessmentExam: any): AssessmentExam {
  return {
    assessment: toAssessment(serverAssessmentExam.assessment),
    exams: serverAssessmentExam.exams.map(toExam)
  };
}

@Injectable()
export class AssessmentExamMapper {
  /**
   * @deprecated use toAssessmentExam
   */
  mapFromApi(serverAssessmentExam: any): AssessmentExam {
    return toAssessmentExam(serverAssessmentExam);
  }

  /**
   * @deprecated use toAssessment & sort at view level
   */
  mapAssessmentsFromApi(serverAssessments: any[]): Assessment[] {
    return serverAssessments.map(toAssessment).sort(byGradeThenByName); // TODO move to backend or make view specific
  }

  /**
   * @deprecated use toExam
   */
  mapExamsFromApi(serverExams: any[]): Exam[] {
    return serverExams.map(toExam);
  }

  mapAssessmentItemsFromApi(serverAssessmentExamItems: any): AssessmentItem[] {
    return serverAssessmentExamItems.assessmentItems
      .map(serverAssessmentItem => {
        const item = toAssessmentItem(serverAssessmentItem);
        item.scores = serverAssessmentExamItems.examItems
          .filter(
            serverExamItem => serverExamItem.itemId === serverAssessmentItem.id
          )
          .map(serverExamItem => toExamItem(serverExamItem));
        return item;
      })
      .sort(ordering(byNumber).on<AssessmentItem>(ai => ai.position).compare);
  }

  /**
   * @deprecated use toTargetScoreExam
   */
  mapTargetScoreExamsFromApi(serverTargetScoreExams: any): TargetScoreExam[] {
    return serverTargetScoreExams.map(toTargetScoreExam);
  }

  /**
   * @deprecated use toTarget
   */
  mapTargetsFromApi(serverTargets: any): Target[] {
    if (serverTargets == null) return [];
    return serverTargets.map(toTarget);
  }

  /**
   * @deprecated use toAssessment
   */
  mapAssessmentFromApi(serverAssessment: any): Assessment {
    return toAssessment(serverAssessment);
  }

  /**
   * @deprecated use toExam
   */
  mapExamFromApi(serverExam: any): Exam {
    return toExam(serverExam);
  }

  /**
   * @deprecated use toStudent
   */
  mapStudentFromApi(serverStudent: any): Student {
    return toStudent(serverStudent);
  }
}
