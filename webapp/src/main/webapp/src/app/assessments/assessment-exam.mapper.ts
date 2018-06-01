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
      const targetScoreExam: TargetScoreExam = this.mapExamFromApi(serverTargetScoreExam);
      targetScoreExam.targetId = serverTargetScoreExam.targetId;
      return targetScoreExam;
    });
  }

  mapTargetsFromApi(serverTargets: any): Target[] {
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
    assessment.label = serverAssessment.label;
    assessment.grade = serverAssessment.gradeCode;
    assessment.type = serverAssessment.typeCode;
    assessment.subject = serverAssessment.subjectCode;
    assessment.claimCodes = serverAssessment.claimCodes || [];
    assessment.cutPoints = serverAssessment.cutPoints || [];
    assessment.resourceUrl = serverAssessment.resourceUrl;
    assessment.hasWerItem = serverAssessment.werItem;
    return assessment;
  }

  mapExamFromApi(serverExam: any): any {
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
      const { migrantStatus, section504, iep, lep, elasCode } = serverExam.studentContext;
      exam.migrantStatus = migrantStatus;
      exam.plan504 = section504;
      exam.iep = iep;
      exam.limitedEnglishProficiency = lep;
      exam.elasCode = elasCode;
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

  private mapAssessmentItemFromApi(apiModel): AssessmentItem {
    const uiModel: AssessmentItem = new AssessmentItem();

    uiModel.id = apiModel.id;
    uiModel.bankItemKey = apiModel.bankItemKey;
    uiModel.position = apiModel.position;
    uiModel.claim = apiModel.claimCode;
    uiModel.target = this.formatTarget(apiModel.targetCode);
    uiModel.targetId = apiModel.targetId;
    uiModel.depthOfKnowledge = apiModel.depthOfKnowledgeCode;
    uiModel.mathPractice = apiModel.mathPracticeCode;
    uiModel.allowCalculator = Utils.booleanToPolarEnum(apiModel.allowCalculator);
    uiModel.difficulty = apiModel.difficultyCode;
    uiModel.maxPoints = apiModel.maximumPoints;
    uiModel.commonCoreStandardIds = apiModel.commonCoreStandardIds || [];
    uiModel.type = apiModel.type;
    uiModel.numberOfChoices = apiModel.optionsCount;
    uiModel.performanceTaskWritingType = apiModel.performanceTaskWritingType;

    // only multiple choice and multiple select have valid answer keys, so ignore the others
    uiModel.answerKey = (apiModel.type === 'MC' || apiModel.type === 'MS') ? apiModel.answerKey : undefined;

    return uiModel;
  }

  formatTarget(target) {
    const dashIndex = target.indexOf('-');

    return dashIndex === -1
      ? target
      : target.substring(0, dashIndex);
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

