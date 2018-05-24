import { NgModule } from '@angular/core';
import { AssessmentDefinitionService } from './assessment-definition.service';
import { AssessmentService } from './assessment.service';

@NgModule({
  providers: [
    AssessmentDefinitionService,
    AssessmentService
  ]
})
export class AssessmentModule {

}
