import { NgModule } from "@angular/core";
import { AssessmentDefinitionService } from "./assessment-definition.service";
import { AssessmentDefinitionResolve } from "./assessment-definition.resolve";
import { AssessmentService } from './assessment.service';

@NgModule({
  providers: [
    AssessmentDefinitionService,
    AssessmentDefinitionResolve,
    AssessmentService
  ]
})
export class AssessmentModule {

}
