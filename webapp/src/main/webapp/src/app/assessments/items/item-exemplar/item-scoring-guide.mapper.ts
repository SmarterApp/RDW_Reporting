import { Injectable } from "@angular/core";
import { ItemScoringGuide } from "./model/item-scoring-guide.model";
import { ScoringCriterion } from "./model/scoring-criterion.model";
import { Utils } from "@sbac/rdw-reporting-common-ngx";

@Injectable()
export class ItemScoringGuideMapper {

  mapFromApi(apiModel: any): ItemScoringGuide {
    let uiModel = new ItemScoringGuide();

    if (!Utils.isNullOrUndefined(apiModel.answerKey) && !Utils.isNullOrUndefined(apiModel.answerKey.value))
      uiModel.answerKeyValue = apiModel.answerKey.value;

    if (!Utils.isNullOrUndefined(apiModel.exemplars))
      uiModel.exemplars = apiModel.exemplars.map(exemplar => this.mapScoringCriterionFomApi(exemplar));

    if (!Utils.isNullOrUndefined(apiModel.rubrics))
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
