import { NgModule } from '@angular/core';
import { AssessmentDefinitionProvider } from './assessment-definition.provider';
import { AssessmentService } from './assessment.service';

@NgModule({
  providers: [
    AssessmentDefinitionProvider,
    AssessmentService
  ]
})
export class AssessmentModule {

}
