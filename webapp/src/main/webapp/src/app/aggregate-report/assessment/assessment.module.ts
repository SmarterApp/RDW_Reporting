import { NgModule } from "@angular/core";
import { AssessmentDefinitionService } from "./assessment-definition.service";
import { AssessmentDefinitionResolve } from "./assessment-definition.resolve";

@NgModule({
  providers: [
    AssessmentDefinitionService,
    AssessmentDefinitionResolve
  ]
})
export class AssessmentModule {

}
