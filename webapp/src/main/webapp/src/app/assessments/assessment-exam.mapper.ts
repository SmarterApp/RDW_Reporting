import { Injectable } from '@angular/core';
import { AssessmentExam } from './model/assessment-exam.model';
import { Assessment } from './model/assessment.model';
import { Exam } from './model/exam.model';
import { AssessmentItem } from './model/assessment-item.model';
import { ExamItemScore } from './model/exam-item-score.model';
import { byGradeThenByName } from './assessment.comparator';
import { ordering } from '@kourge/ordering';
import { byNumber } from '@kourge/ordering/comparator';
import { ClaimScore } from './model/claim-score.model';
import { Student } from '../student/model/student.model';
import { Utils } from '../shared/support/support';
import { DefaultSchool, School } from '../shared/organization/organization';
import { TargetScoreExam } from './model/target-score-exam.model';
import { Target } from './model/target.model';

@Injectable()
export class AssessmentExamMapper {

  mapFromApi(serverAssessmentExam: any): AssessmentExam {
    const assessmentExam = new AssessmentExam();
    assessmentExam.assessment = this.mapAssessmentFromApi(serverAssessmentExam.assessment);
    assessmentExam.exams = serverAssessmentExam.exams.map(serverExam => this.mapExamFromApi(serverExam));
    return assessmentExam;
  }

  mapAssessmentsFromApi(serverAssessments: any[]): Assessment[] {
    return serverAssessments
      .map(serverAssessment => this.mapAssessmentFromApi(serverAssessment))
      .sort(byGradeThenByName); // TODO move to backend or make view specific
  }

  mapExamsFromApi(serverExams: any[]): Exam[] {
    return serverExams.map(serverExam => this.mapExamFromApi(serverExam));
  }

  mapAssessmentItemsFromApi(serverAssessmentExamItems: any): AssessmentItem[] {
    return serverAssessmentExamItems.assessmentItems
      .map(serverAssessmentItem => {
        const item = this.mapAssessmentItemFromApi(serverAssessmentItem);
        item.scores = serverAssessmentExamItems.examItems
          .filter(serverExamItem => serverExamItem.itemId === serverAssessmentItem.id)
          .map(serverExamItem => this.mapExamItemFromApi(serverExamItem));
        return item;
      })
      .sort(ordering(byNumber).on<AssessmentItem>(ai => ai.position).compare);
  }

  mapTargetScoreExamsFromApi(serverTargetScoreExams: any): TargetScoreExam[] {
    return serverTargetScoreExams.map((serverTargetScoreExam: any) => {
      const targetScoreExam = <TargetScoreExam>this.mapExamFromApi(serverTargetScoreExam);
      targetScoreExam.targetId = serverTargetScoreExam.targetId;
      targetScoreExam.standardMetRelativeResidualScore = serverTargetScoreExam.standardMetRelativeResidualScore;
      targetScoreExam.studentRelativeResidualScore = serverTargetScoreExam.studentRelativeResidualScore;
      return targetScoreExam;
    });
  }

  mapTargetsFromApi(serverTargets: any): Target[] {
    if (serverTargets == null) return [];

    return serverTargets.map((serverTarget: any) => {
      return <Target>{
        id: serverTarget.id,
        assessmentId: serverTarget.assessmentId,
        claimCode: serverTarget.claimCode,
        naturalId: serverTarget.naturalId,
        includeInReport: serverTarget.includeInReport,
      };
    });
  }

  mapAssessmentFromApi(serverAssessment: any): Assessment {
    const assessment = new Assessment();
    assessment.id = serverAssessment.id;
    assessment.name = serverAssessment.name;
    assessment.label = serverAssessment.label;
    assessment.grade = serverAssessment.gradeCode;
    assessment.type = serverAssessment.typeCode;
    assessment.subject = serverAssessment.subjectCode;
    assessment.claimCodes = serverAssessment.claimCodes || [];
    assessment.cutPoints = serverAssessment.cutPoints || [];
    assessment.resourceUrl = serverAssessment.resourceUrl;
    assessment.hasWerItem = serverAssessment.werItem;
    assessment.targetReportEnabled = serverAssessment.targetReportEnabled;
    return assessment;
  }

  mapExamFromApi(serverExam: any): Exam {
    const exam: Exam = new Exam();
    exam.id = serverExam.id;
    exam.date = serverExam.dateTime;
    exam.session = serverExam.sessionId;
    exam.enrolledGrade = serverExam.gradeCode;
    exam.administrativeCondition = serverExam.administrativeConditionCode;
    exam.completeness = serverExam.completenessCode;
    exam.schoolYear = serverExam.schoolYear;
    exam.transfer = serverExam.transfer;
    exam.school = this.createSchool(serverExam.school);
    exam.claimScores = (serverExam.claimScaleScores || [])
      .map(serverScaleScore => this.mapClaimScaleScoreFromApi(serverScaleScore));

    if (serverExam.studentContext) {
      const { migrantStatus, section504, iep, lep, elasCode, languageCode, militaryConnectedCode } = serverExam.studentContext;
      exam.migrantStatus = migrantStatus;
      exam.plan504 = section504;
      exam.iep = iep;
      exam.limitedEnglishProficiency = lep;
      exam.elasCode = elasCode;
      exam.languageCode = languageCode;
      exam.militaryConnectedCode = militaryConnectedCode;
    }

    if (serverExam.student) {
      exam.student = this.mapStudentFromApi(serverExam.student);
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

  mapStudentFromApi(serverStudent: any): Student {
    const student: Student = new Student();
    student.id = serverStudent.id;
    student.ssid = serverStudent.ssid;
    student.firstName = serverStudent.firstName;
    student.lastName = serverStudent.lastName;
    student.genderCode = serverStudent.genderCode;
    student.ethnicityCodes = serverStudent.ethnicityCodes;
    return student;
  }

  private mapExamItemFromApi(serverExamItem: any): ExamItemScore {
    const examItem: ExamItemScore = new ExamItemScore();
    examItem.examId = serverExamItem.examId;
    examItem.points = serverExamItem.points;
    examItem.position = serverExamItem.position;
    examItem.response = serverExamItem.response;
    examItem.writingTraitScores = serverExamItem.writingTraitScores;
    return examItem;
  }

  private mapAssessmentItemFromApi(serverItem: any): AssessmentItem {
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
    item.answerKey = (serverItem.type === 'MC' || serverItem.type === 'MS') ? serverItem.answerKey : undefined;

    return item;
  }

  private mapClaimScaleScoreFromApi(apiScaleScore: any): ClaimScore {
    const uiModel: ClaimScore = new ClaimScore();

    if (apiScaleScore) {
      uiModel.level = apiScaleScore.level;
      uiModel.score = apiScaleScore.value;
      uiModel.standardError = apiScaleScore.standardError;
    }

    return uiModel;
  }

  private createSchool(serverExamSchool: any): School {
    const school: DefaultSchool = new DefaultSchool();
    school.name = serverExamSchool.name;
    school.id = serverExamSchool.id;
    return school;
  }


}

