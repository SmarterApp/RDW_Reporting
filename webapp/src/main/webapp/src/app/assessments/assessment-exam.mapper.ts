import { Injectable } from "@angular/core";
import { AssessmentExam } from "./model/assessment-exam.model";
import { Assessment } from "./model/assessment.model";
import { Exam } from "./model/exam.model";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentItem } from "./model/assessment-item.model";
import { ExamItemScore } from "./model/exam-item-score.model";
import { byGradeThenByName } from "./assessment.comparator";
import { ordering } from "@kourge/ordering";
import { byNumber } from "@kourge/ordering/comparator";
import { ClaimScore } from "./model/claim-score.model";

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

      uiModels.push(assessmentItem);
    }

    uiModels.sort(ordering(byNumber).on<AssessmentItem>(ai => ai.position).compare);
    return uiModels;
  }

  mapAssessmentFromApi(apiModel: any): Assessment {
    let uiModel = new Assessment();

    uiModel.id = apiModel.id;
    uiModel.name = apiModel.name;
    uiModel.grade = apiModel.gradeId;
    uiModel.type = AssessmentType[ apiModel.type as string ];
    uiModel.subject = apiModel.subject;
    uiModel.claimCodes = apiModel.claimCodes || [];

    return uiModel;
  }

  mapExamFromApi(apiModel): Exam {
    let uiModel: Exam = new Exam();

    uiModel.id = apiModel.id;
    uiModel.date = apiModel.dateTime;
    uiModel.session = apiModel.sessionId;
    uiModel.administrativeCondition = apiModel.administrativeConditionCode;
    uiModel.completeness = apiModel.completenessCode;
    uiModel.schoolYear = apiModel.schoolYear;
    uiModel.ethnicities = [];
    uiModel.claimScores = this.mapClaimScaleScoresFromApi(apiModel.claimScaleScores);

    if (apiModel.studentContext) {
      uiModel.enrolledGrade = apiModel.studentContext.gradeId;
      uiModel.migrantStatus = apiModel.studentContext.migrantStatus;
      uiModel.plan504 = apiModel.studentContext.section504;
      uiModel.iep = apiModel.studentContext.iep;
      uiModel.economicDisadvantage = apiModel.studentContext.economicDisadvantage;
      uiModel.limitedEnglishProficiency = apiModel.studentContext.lep;
    }

    if (apiModel.student) {
      uiModel.studentName = `${apiModel.student.lastName}, ${apiModel.student.firstName}`;
      uiModel.gender = apiModel.student.genderCode;

      if (apiModel.student.ethnicityCodes) {
        apiModel.student.ethnicityCodes.forEach(code => uiModel.ethnicities.push(code));
      }
    }

    if (apiModel.scaleScore) {
      uiModel.score = apiModel.scaleScore.value;
      uiModel.level = apiModel.scaleScore.level;
      uiModel.standardError = apiModel.scaleScore.standardError;
    }

    return uiModel;
  }

  private mapExamItemFromApi(apiModel) {
    let uiModel: ExamItemScore = new ExamItemScore();

    uiModel.examId = apiModel.examId;
    uiModel.points = apiModel.points;
    uiModel.position = apiModel.position;

    return uiModel;
  }

  private mapAssessmentItemFromApi(apiModel) {
    let uiModel: AssessmentItem = new AssessmentItem();

    uiModel.id = apiModel.id;
    uiModel.position = apiModel.id; // TODO: Update item position from API
    uiModel.claim = apiModel.claim;
    uiModel.target = apiModel.target;
    uiModel.difficulty = apiModel.difficultyCode;
    uiModel.maxPoints = apiModel.maximumPoints;

    return uiModel;
  }

  private mapClaimScaleScoresFromApi(apiScaleScores: any[]): ClaimScore[] {
    if (!Array.isArray(apiScaleScores)) return [];

    return apiScaleScores
      .map((apiScore) => this.mapClaimScaleScoreFromApi(apiScore));
  }

  private mapClaimScaleScoreFromApi(apiScaleScore: any): ClaimScore {
    let uiModel: ClaimScore = new ClaimScore();
    uiModel.level = apiScaleScore.level;
    uiModel.score = apiScaleScore.value;
    uiModel.standardError = apiScaleScore.standardError;

    return uiModel;
  }
}

