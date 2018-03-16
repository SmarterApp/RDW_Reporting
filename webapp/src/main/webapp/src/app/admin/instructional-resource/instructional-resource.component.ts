import { Component, OnInit } from '@angular/core';
import { InstructionalResource } from "./model/instructional-resource.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CreateInstructionalResourceModal } from "./create-instructional-resource.modal";
import { InstructionalResourceService } from "./instructional-resource.service";
import { TranslateService } from "@ngx-translate/core";
import { UpdateInstructionalResourceModal } from "./update-instructional-resource.modal";
import { DeleteInstructionalResourceModal } from "./delete-instructional-resource.modal";
import { PopupMenuAction } from "../../shared/menu/popup-menu-action.model";
import { Utils } from "../../shared/support/support";

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
  columns: Column[] = [
    new Column({id: 'assessment-label', field: 'assessmentLabel'}),
    new Column({id: 'organization-type', field: 'organizationType'}),
    new Column({id: 'organization-name', field: 'organizationName'}),
    new Column({id: 'performance-level', field: 'performanceLevel'}),
    new Column({id: 'resource', sortable: false})
  ];


  get resources(): InstructionalResource[] {
    return this._resources;
  }

  set resources(resources: InstructionalResource[]) {
    this._resources = resources;
    this.updateFilteredResources();
  }

  get loading(): boolean {
    return Utils.isNullOrUndefined(this.resources);
  }

  private _resources: InstructionalResource[];

  constructor(private modalService: BsModalService,
              private service: InstructionalResourceService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.service.findAll()
      .subscribe((resources: InstructionalResource[]) => {
        this.resources = resources;
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
    let modalReference: BsModalRef = this.modalService.show(CreateInstructionalResourceModal, { backdrop: 'static' });
    let modal: CreateInstructionalResourceModal = modalReference.content;
    modal.existingResources = this._resources;
    modal.created.subscribe(resource => {
      this.resources.push(resource);
      this.updateFilteredResources();
    });
  }

  private openUpdateResourceModal(resource: InstructionalResource): void {
    let modalReference: BsModalRef = this.modalService.show(UpdateInstructionalResourceModal);
    let modal: UpdateInstructionalResourceModal = modalReference.content;
    modal.resource = resource;
    modal.updated.subscribe(updatedResource => {
      resource.resource = updatedResource.resource;
      this.updateFilteredResources();
    });
  }

  private openDeleteResourceModal(resource: InstructionalResource): void {
    let modalReference: BsModalRef = this.modalService.show(DeleteInstructionalResourceModal);
    let modal: DeleteInstructionalResourceModal = modalReference.content;
    modal.resource = resource;
    modal.deleted.subscribe(deletedResource => {
      this.resources = this.resources.filter((x) => x != deletedResource);
    });
  }

  private updateFilteredResources(): void {
    this.filteredResources = this.resources
      .filter(resource =>
        resource.assessmentName.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0 ||
        resource.assessmentLabel.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0 ||
        resource.organizationName.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0);
  }

  private createActions(): PopupMenuAction[] {

    const updateAction: PopupMenuAction = new PopupMenuAction();
    updateAction.displayName = () => this.translateService.instant("update-instructional-resource-modal.link");
    updateAction.perform = (resource: InstructionalResource) => this.openUpdateResourceModal(resource);

    const deleteAction: PopupMenuAction = new PopupMenuAction();
    deleteAction.displayName = () => this.translateService.instant("delete-instructional-resource-modal.link");
    deleteAction.perform = (resource: InstructionalResource) => this.openDeleteResourceModal(resource);

    return [ updateAction, deleteAction ];
  }

}

class Column {
  id: string;
  field: string;
  sortable: boolean;

  constructor({
                id,
                field = '',
                sortable = true
              }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortable = sortable;
  }
}
