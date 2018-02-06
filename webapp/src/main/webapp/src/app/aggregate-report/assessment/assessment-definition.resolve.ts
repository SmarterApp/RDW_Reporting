import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { AssessmentDefinitionService } from "./assessment-definition.service";
import { Injectable } from "@angular/core";
import { AssessmentDefinition } from "./assessment-definition";
import { Observable } from "rxjs/Observable";

/**
 * Resolves assessment type definitions and properties
 */
@Injectable()
export class AssessmentDefinitionResolve implements Resolve<Map<string, AssessmentDefinition>> {

  constructor(private service: AssessmentDefinitionService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Map<string, AssessmentDefinition>> {
    return this.service.getDefinitionsByAssessmentTypeCode();
  }

}
