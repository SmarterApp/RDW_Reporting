import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AssessmentDefinitionService, DefinitionKey } from './assessment-definition.service';
import { Injectable } from '@angular/core';
import { AssessmentDefinition } from './assessment-definition';
import { Observable } from 'rxjs/Observable';

/**
 * Resolves assessment type definitions and properties
 */
@Injectable()
export class AssessmentDefinitionResolve implements Resolve<Map<{ assessmentType: string, reportType: string }, AssessmentDefinition>> {

  constructor(private service: AssessmentDefinitionService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Map<DefinitionKey, AssessmentDefinition>> {
    return this.service.getDefinitionsByAssessmentTypeCode();
  }

}
