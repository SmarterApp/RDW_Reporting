import { Component, OnInit } from '@angular/core';
import { InstructionalResource } from "./model/instructional-resource.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CreateInstructionalResourceModal } from "./create-instructional-resource.modal";
import { Subscription } from "rxjs/Subscription";
import { InstructionalResourceService } from "./instructional-resource.service";
import { PopupMenuAction } from "@sbac/rdw-reporting-common-ngx";
import { TranslateService } from "@ngx-translate/core";
import { UpdateInstructionalResourceModal } from "./update-instructional-resource.modal";
import { DeleteInstructionalResourceModal } from "./delete-instructional-resource.modal";

/**
 * This component displays the user's permitted instructional resources.
 * It allows updating and deleting existing instructional resources as well as
 * creating new instructional resources.
 */
@Component({
  selector: 'instructional-resource',
  templateUrl: './instructional-resource.component.html'
})
export class InstructionalResourceComponent implements OnInit {

  searchTerm: string = '';
  filteredResources: InstructionalResource[] = [];
  actions: PopupMenuAction[];

  private _resources: InstructionalResource[];
  get resources(): InstructionalResource[] {
    return this._resources;
  }
  set resources(resources: InstructionalResource[]) {
    this._resources = resources;
    this.updateFilteredResources();
  }

  private _modalSubscriptions: Subscription[] = [];

  constructor(private modalService: BsModalService,
              private service: InstructionalResourceService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.service.findAll()
      .toPromise()
      .then((resources) => {
        this.resources = resources
      });

    this.actions = this.createActions();
  }

  onSearchChange(): void {
    this.updateFilteredResources();
  }

  /**
   * Open the "Create" modal dialog.  Prevent off-clicks from closing the modal form.
   */
  openCreateResourceModal(): void {
    let modalReference: BsModalRef = this.modalService.show(CreateInstructionalResourceModal, {backdrop: 'static'});
    let modal: CreateInstructionalResourceModal = modalReference.content;
    this._modalSubscriptions.push(modal.created.subscribe(resource => {
      this.resources.push(resource);
      this.updateFilteredResources();
    }));
    this._modalSubscriptions.push(this.modalService.onHidden.subscribe(() => {
      this.unsubscribe();
    }));
  }

  private openUpdateResourceModal(resource: InstructionalResource): void {
    let modalReference: BsModalRef = this.modalService.show(UpdateInstructionalResourceModal);
    let modal: UpdateInstructionalResourceModal = modalReference.content;
    modal.resource = resource;
    this._modalSubscriptions.push(modal.updated.subscribe(updatedResource => {
      resource.resource = updatedResource.resource;
      this.updateFilteredResources();
    }));
    this._modalSubscriptions.push(this.modalService.onHidden.subscribe(() => {
      this.unsubscribe();
    }));
  }

  private openDeleteResourceModal(resource: InstructionalResource):void {
    let modalReference: BsModalRef = this.modalService.show(DeleteInstructionalResourceModal);
    let modal: DeleteInstructionalResourceModal = modalReference.content;
    modal.resource = resource;
    this._modalSubscriptions.push(modal.deleted.subscribe(deletedResource => {
      this.resources = this.resources.filter((x) => x != deletedResource);
    }));
    this._modalSubscriptions.push(this.modalService.onHidden.subscribe(() => {
      this.unsubscribe();
    }));
  }

  private unsubscribe(): void {
    this._modalSubscriptions.forEach(subscription => subscription.unsubscribe());
    this._modalSubscriptions = [];
  }

  private updateFilteredResources(): void {
    this.filteredResources = this.resources
      .filter(resource =>
        resource.assessmentName.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0 ||
        resource.assessmentLabel.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0 ||
        resource.organizationName.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0);
  }

  private createActions(): PopupMenuAction[] {
    let actions: PopupMenuAction[] = [];

    let updateAction: PopupMenuAction = new PopupMenuAction();
    updateAction.displayName = () => this.translateService.instant("labels.instructional-resource.update.title");
    updateAction.perform = (resource: InstructionalResource) => this.openUpdateResourceModal(resource);
    actions.push(updateAction);

    let deleteAction: PopupMenuAction = new PopupMenuAction();
    deleteAction.displayName = () => this.translateService.instant("labels.instructional-resource.delete.title");
    deleteAction.perform = (resource: InstructionalResource) => this.openDeleteResourceModal(resource);
    actions.push(deleteAction);

    return actions;
  }
}
