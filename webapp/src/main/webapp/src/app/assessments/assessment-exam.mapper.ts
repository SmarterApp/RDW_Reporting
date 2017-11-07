import { Injectable } from "@angular/core";
import { AssessmentExam } from "./model/assessment-exam.model";
import { Assessment } from "./model/assessment.model";
import { Exam } from "./model/exam.model";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentItem } from "./model/assessment-item.model";
import { ExamItemScore } from "./model/exam-item-score.model";
import { byGradeThenByName } from "./assessment.comparator";
import { ordering } from "@kourge/ordering";
import { byNumber, byString } from "@kourge/ordering/comparator";
import { ClaimScore } from "./model/claim-score.model";
import { Student } from "../student/model/student.model";
import { Utils } from "@sbac/rdw-reporting-common-ngx";
import { School } from "../user/model/school.model";

@Injectable()
export class AssessmentExamMapper {

  mapFromApi(apiModel): AssessmentExam {
    let uiModel = new AssessmentExam();

    uiModel.assessment = this.mapAssessmentFromApi(apiModel.assessment);
    uiModel.exams = [];

    apiModel.exams.forEach(x =>
      uiModel.exams.push(this.mapExamFromApi(x))
    );

    return uiModel;
  }

  mapAssessmentsFromApi(apiModels): Assessment[] {
    let uiModels = apiModels.map(x => this.mapAssessmentFromApi(x));
    uiModels.sort(byGradeThenByName);
    return uiModels;
  }

  mapExamsFromApi(apiModels): Exam[] {
    return apiModels.map(x => this.mapExamFromApi(x));
  }

  mapAssessmentItemsFromApi(apiModel) {
    let uiModels: AssessmentItem[] = [];

    for (let apiAssessment of apiModel.assessmentItems) {
      let assessmentItem = this.mapAssessmentItemFromApi(apiAssessment);

      for (let apiExamItem of apiModel.examItems.filter(x => x.itemId == assessmentItem.id)) {
        assessmentItem.scores.push(this.mapExamItemFromApi(apiExamItem));
      }

      // TODO: DWR-1068: Move all of the below mapping to mapAssessmentItemFromApi method.

      // TODO: DWR-1068: Api should return this info instead of "guessing" here.
      assessmentItem.isMultipleChoice = assessmentItem.scores.some(x => x.response != null && x.response.length == 1);

      // TODO: DWR-1068: Api should return this info instead of "guessing" here.
      assessmentItem.isMultipleSelect = assessmentItem.scores.some(x => x.response != null && x.response.indexOf(',') !== -1);

      // TODO: remove.
      let choices = "_ABCDEFGHIJLKMNOPQRSTUVWXYZ";

      // TODO: DWR-1068: Api should return this info instead of "guessing' here.
      if (assessmentItem.isMultipleChoice) {
        assessmentItem.numberOfChoices = choices
          .indexOf(assessmentItem.scores
            .filter(x => x.response != null)
            .sort(ordering(byString).reverse().on<ExamItemScore>(x => x.response).compare)
            [ 0 ].response);

        let rand = Math.floor(Math.random() * assessmentItem.numberOfChoices + 1);
        assessmentItem.answerKey = choices[rand];
      }

      // TODO: DWR-1068: Api should return this info instead of mocking it here.
      if (assessmentItem.isMultipleSelect) {
        assessmentItem.numberOfChoices = 4;
        let rand1 = Math.floor(Math.random() * 2 + 1);
        let rand2 = Math.floor(Math.random() * 2 + 3);

        assessmentItem.answerKey = choices[rand1] + "," + choices[rand2];
      }

      uiModels.push(assessmentItem);
    }

    uiModels.sort(ordering(byNumber).on<AssessmentItem>(ai => ai.position).compare);
    return uiModels;
  }

  mapAssessmentFromApi(apiModel: any): Assessment {
    let uiModel = new Assessment();

    uiModel.id = apiModel.id;
    uiModel.name = apiModel.name;
    uiModel.grade = apiModel.gradeCode;
    uiModel.type = AssessmentType[ apiModel.type as string ];
    uiModel.subject = apiModel.subject;
    uiModel.claimCodes = apiModel.claimCodes || [];
    uiModel.cutPoints = apiModel.cutPoints || [];
    uiModel.resourceUrl = apiModel.resourceUrl;

    return uiModel;
  }

  mapExamFromApi(apiModel): Exam {
    let uiModel: Exam = new Exam();

    uiModel.id = apiModel.id;
    uiModel.date = apiModel.dateTime;
    uiModel.session = apiModel.sessionId;
    uiModel.enrolledGrade = apiModel.gradeCode;
    uiModel.administrativeCondition = apiModel.administrativeConditionCode;
    uiModel.completeness = apiModel.completenessCode;
    uiModel.schoolYear = apiModel.schoolYear;

    let school: School = new School();
    school.name = apiModel.school.name;
    school.id = apiModel.school.id;
    uiModel.school = school;

    if (apiModel.claimScaleScores) {
      uiModel.claimScores = this.mapClaimScaleScoresFromApi(apiModel.claimScaleScores);
    }

    if (apiModel.studentContext) {
      uiModel.migrantStatus = apiModel.studentContext.migrantStatus;
      uiModel.plan504 = apiModel.studentContext.section504;
      uiModel.iep = apiModel.studentContext.iep;
      uiModel.economicDisadvantage = apiModel.studentContext.economicDisadvantage;
      uiModel.limitedEnglishProficiency = apiModel.studentContext.lep;
    }

    if (apiModel.student) {
      uiModel.student = this.mapStudentFromApi(apiModel.student);
    }

    if (apiModel.scaleScore) {
      uiModel.score = apiModel.scaleScore.value;
      uiModel.level = apiModel.scaleScore.level;
      uiModel.standardError = apiModel.scaleScore.standardError;
    }

    uiModel.accommodationCodes = [];
    if (apiModel.accommodationCodes) {
      apiModel.accommodationCodes.forEach(code => uiModel.accommodationCodes.push(code));
    }

    return uiModel;
  }

  mapStudentFromApi(apiModel): Student {
    let uiModel: Student = new Student();
    uiModel.id = apiModel.id;
    uiModel.ssid = apiModel.ssid;
    uiModel.firstName = apiModel.firstName;
    uiModel.lastName = apiModel.lastName;
    uiModel.genderCode = apiModel.genderCode;
    uiModel.ethnicityCodes = [];
    if (apiModel.ethnicityCodes) {
      apiModel.ethnicityCodes.forEach(code => uiModel.ethnicityCodes.push(code));
    }

    return uiModel;
  }

  private mapExamItemFromApi(apiModel): ExamItemScore {
    let uiModel: ExamItemScore = new ExamItemScore();

    uiModel.examId = apiModel.examId;
    uiModel.points = apiModel.points;
    uiModel.position = apiModel.position;
    uiModel.response = apiModel.response;

    return uiModel;
  }

  private mapAssessmentItemFromApi(apiModel): AssessmentItem {
    let uiModel: AssessmentItem = new AssessmentItem();

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

    return uiModel;
  }

  formatTarget(target) {
    let dashIndex = target.indexOf("-");

    return dashIndex === -1
      ? target
      : target.substring(0, dashIndex);
  }

  private mapClaimScaleScoresFromApi(apiScaleScores: any[]): ClaimScore[] {
    if (!Array.isArray(apiScaleScores)) return [];

    return apiScaleScores
      .map(apiScore => this.mapClaimScaleScoreFromApi(apiScore));
  }

  private mapClaimScaleScoreFromApi(apiScaleScore: any): ClaimScore {
    let uiModel: ClaimScore = new ClaimScore();

    if (apiScaleScore) {
      uiModel.level = apiScaleScore.level;
      uiModel.score = apiScaleScore.value;
      uiModel.standardError = apiScaleScore.standardError;
    }

    return uiModel;
  }
}

