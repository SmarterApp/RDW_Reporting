import { Injectable } from "@angular/core";
import { ItemScoringGuide } from "./model/item-scoring-guide.model";
import { isNullOrUndefined } from "util";
import { ScoringCriterion } from "./model/scoring-criterion.model";

@Injectable()
export class ItemScoringGuideMapper {

  mapFromApi(apiModel: any): ItemScoringGuide {
    let uiModel = new ItemScoringGuide();
    if (!apiModel) return uiModel;

    if (!isNullOrUndefined(apiModel.answerKey) && !isNullOrUndefined(apiModel.answerKey.value))
      uiModel.answerKeyValue = apiModel.answerKey.value;

    if (!isNullOrUndefined(apiModel.exemplars))
      uiModel.exemplars = apiModel.exemplars.map(exemplar => this.mapScoringCriterionFomApi(exemplar));

    if (!isNullOrUndefined(apiModel.rubrics))
      uiModel.rubrics = apiModel.rubrics.map(rubric => this.mapScoringCriterionFomApi(rubric));

    return uiModel;
  }

  private mapScoringCriterionFomApi(apiModel: any): ScoringCriterion {
    let uiModel = new ScoringCriterion();
    uiModel.scorepoint = apiModel.scorepoint;
    uiModel.templateHtml = apiModel.template;
    return uiModel;
  }

}
