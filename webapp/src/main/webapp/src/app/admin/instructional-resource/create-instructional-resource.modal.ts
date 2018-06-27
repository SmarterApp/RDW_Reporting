import { BsModalRef } from "ngx-bootstrap";
import { Component, EventEmitter, OnDestroy } from "@angular/core";
import { InstructionalResource } from "./model/instructional-resource.model";
import { InstructionalResourceService } from "./instructional-resource.service";
import { Assessment } from "./model/assessment.model";
import { AssessmentService } from "./assessment.service";
import { AssessmentQuery } from "./model/assessment-query.model";
import { Observable } from "rxjs/Observable";
import { Organization } from "./model/organization.model";
import { OrganizationService } from "./organization.service";
import { OrganizationQuery } from "./model/organization-query.model";
import { ValidationErrors } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { NavigationStart, Router } from "@angular/router";
import { filter, mergeMap } from 'rxjs/operators';
import { Utils } from "../../shared/support/support";
import { SubjectService } from '../../subject/subject.service';
import { SubjectDefinition } from '../../subject/subject';

/**
 * This modal component displays an instructional resource creation form.
 */
@Component({
  selector: 'create-instructional-resource-modal',
  templateUrl: './create-instructional-resource.modal.html'
})
export class CreateInstructionalResourceModal implements OnDestroy {

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

  subjectDefinitions: SubjectDefinition[] = [];

  resourceUrl: string;

  private _subscription: Subscription;

  constructor(private modal: BsModalRef,
              private assessmentService: AssessmentService,
              private organizationService: OrganizationService,
              private resourceService: InstructionalResourceService,
              private subjectService: SubjectService,
              private router: Router) {

    this.assessmentSource = Observable.create((observer: any) => {
      observer.next(this.assessmentSearch);
    }).pipe(
      mergeMap((token: string) => this.findAssessments(token))
    );

    this.organizationSource = Observable.create((observer: any) => {
      observer.next(this.organizationSearch);
    }).pipe(
      mergeMap((token: string) => this.findOrganizations(token))
    );

    this._subscription = router.events.pipe(
      filter(e => e instanceof NavigationStart)
    ).subscribe(() => {
      this.cancel();
    });

    this.subjectService.getSubjectDefinitions()
      .subscribe(subjectDefinitions => {
        this.subjectDefinitions = subjectDefinitions;
      });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  cancel() {
    this.modal.hide();
  }

  create() {
    const resource: InstructionalResource = new InstructionalResource();
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
    const query: AssessmentQuery = new AssessmentQuery();
    query.label = search;

    return this.assessmentService.find(query)
      .map(this.removeDuplicateNames);
  }

  onAssessmentSelect(assessment: Assessment): void {
    this.assessment = assessment;
    this.performanceLevels = this.getPerformanceLevels(this.assessment.subject, this.assessment.type);
    this.validateExisting();
  }

  findOrganizations(search: string): Observable<Organization[]> {
    const query: OrganizationQuery = new OrganizationQuery();
    query.types = [ 'State', 'DistrictGroup', 'District', 'SchoolGroup' ];
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
    return !Utils.isNullOrUndefined(this.assessment) &&
      !Utils.isNullOrUndefined(this.organization) &&
      this.performanceLevel >= 0 &&
      !this.duplicateResource;
  }

  private validateExisting(): ValidationErrors | null {
    if (!this.organization || !this.assessment || this.performanceLevel < 0) {
      this.duplicateResource = false;
      return;
    }

    const existingResource = this.existingResources.find((resource: InstructionalResource) => {
      return resource.assessmentName === this.assessment.name &&
        resource.organizationType === this.organization.organizationType &&
        resource.organizationId === this.organization.id &&
        resource.performanceLevel === this.performanceLevel;
    });
    this.duplicateResource = (existingResource != null);
  }

  private removeDuplicateNames(assessments: Assessment[]): Assessment[] {
    const assessmentNames = [];
    return assessments.filter(assessment => {
      if (assessmentNames.indexOf(assessment.name) >= 0) {
        return false;
      }
      assessmentNames.push(assessment.name);
      return true;
    });
  }

  private getPerformanceLevels(subject: string, assessmentType: string): number[] {
    const subjectDefinition = this.subjectDefinitions.find(x => x.assessmentType == assessmentType && x.subject == subject);
    return subjectDefinition.performanceLevels;
  }
}
