import { BsModalRef } from "ngx-bootstrap";
import { Component, EventEmitter } from "@angular/core";
import { InstructionalResource } from "./model/instructional-resource.model";
import { InstructionalResourceService } from "./instructional-resource.service";
import { Assessment } from "./model/assessment.model";
import { AssessmentService } from "./assessment.service";
import { AssessmentQuery } from "./model/assessment-query.model";
import { Observable } from "rxjs/Observable";
import { isNullOrUndefined } from "util";
import { Organization } from "./model/organization.model";
import { OrganizationService } from "./organization.service";
import { OrganizationQuery } from "./model/organization-query.model";
import * as _ from "lodash";
import { ValidationErrors } from "@angular/forms";

/**
 * This modal component displays an instructional resource creation form.
 */
@Component({
  selector: 'create-instructional-resource-modal',
  templateUrl: './create-instructional-resource.modal.html'
})
export class CreateInstructionalResourceModal {

  existingResources: InstructionalResource[] = [];
  unableToCreate: boolean = false;
  duplicateResource: boolean = false;
  created: EventEmitter<InstructionalResource> = new EventEmitter();

  assessmentSource: Observable<Assessment[]>;
  assessment: Assessment;
  assessmentSearch: string;
  assessmentLoading: boolean;
  assessmentNoResults: boolean;

  organizationSource: Observable<Organization[]>;
  organization: Organization;
  organizationSearch: string;
  organizationLoading: boolean;
  organizationNoResults: boolean;

  performanceLevels: number[];
  performanceLevel: number = -1;

  resourceUrl: string;

  constructor(private modal: BsModalRef,
              private assessmentService: AssessmentService,
              private organizationService: OrganizationService,
              private resourceService: InstructionalResourceService) {

    this.assessmentSource = Observable.create((observer: any) => {
      observer.next(this.assessmentSearch);
    }).mergeMap((token: string) => this.findAssessments(token));

    this.organizationSource = Observable.create((observer: any) => {
      observer.next(this.organizationSearch);
    }).mergeMap((token: string) => this.findOrganizations(token));
  }

  cancel() {
    this.modal.hide();
  }

  create() {
    let resource: InstructionalResource = new InstructionalResource();
    resource.performanceLevel = this.performanceLevel;
    resource.organizationType = this.organization.organizationType;
    resource.assessmentName = this.assessment.name;
    resource.organizationId = this.organization.id;
    resource.resource = this.resourceUrl;
    this.resourceService.create(resource).subscribe(
      (newResource) => {
        this.modal.hide();
        this.created.emit(newResource);
      },
      () => {
        this.unableToCreate = true;
      });
  }

  findAssessments(search: string): Observable<Assessment[]> {
    let query: AssessmentQuery = new AssessmentQuery();
    query.label = search;

    return this.assessmentService.find(query)
      .map(this.removeDuplicateNames);
  }

  onAssessmentSelect(assessment: Assessment): void {
    this.assessment = assessment;
    this.performanceLevels = this.getPerformanceLevels(this.assessment.type);
    this.validateExisting();
  }

  findOrganizations(search: string): Observable<Organization[]> {
    let query: OrganizationQuery = new OrganizationQuery();
    query.types = ['State', 'DistrictGroup', 'District', 'SchoolGroup'];
    query.name = search;

    return this.organizationService.find(query);
  }

  onOrganizationSelect(organization: Organization): void {
    this.organization = organization;
    this.validateExisting();
  }

  onPerformanceLevelSelect(): void {
    this.validateExisting();
  }

  valid(): boolean {
    return !isNullOrUndefined(this.assessment) &&
      !isNullOrUndefined(this.organization) &&
      this.performanceLevel >= 0 &&
      !this.duplicateResource;
  }

  private validateExisting(): ValidationErrors | null {
    if (!this.organization || !this.assessment || this.performanceLevel < 0) {
      this.duplicateResource = false;
      return
    }

    let existingResource = _.find(this.existingResources, (existingResource: InstructionalResource) => {
      return existingResource.assessmentName == this.assessment.name &&
        existingResource.organizationType == this.organization.organizationType &&
        existingResource.organizationId == this.organization.id &&
        existingResource.performanceLevel == this.performanceLevel;
    });
    this.duplicateResource = (existingResource != null);
  }

  private removeDuplicateNames(assessments: Assessment[]): Assessment[] {
    let assessmentNames = [];
    return assessments.filter(assessment => {
      if (assessmentNames.indexOf(assessment.name) >= 0) {
        return false;
      }
      assessmentNames.push(assessment.name);
      return true;
    })
  }

  private getPerformanceLevels(assessmentType: string): number[] {
    return assessmentType == "IAB" ? [1, 2, 3] : [1, 2, 3, 4];
  }
}
