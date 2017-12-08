import { Component, EventEmitter } from "@angular/core";
import { InstructionalResource } from "./model/instructional-resource.model";
import { BsModalRef } from "ngx-bootstrap";
import { InstructionalResourceService } from "./instructional-resource.service";

/**
 * This modal component displays an instructional resource delete confirmation.
 */
@Component({
  selector: 'delete-instructional-resource-modal',
  templateUrl: './delete-instructional-resource.modal.html'
})
export class DeleteInstructionalResourceModal {

  resource: InstructionalResource = new InstructionalResource();
  unableToDelete: boolean = false;
  deleted: EventEmitter<InstructionalResource> = new EventEmitter();

  constructor(private modal: BsModalRef,
              private resourceService: InstructionalResourceService) {
  }

  cancel() {
    this.modal.hide();
  }

  delete() {
    this.resourceService.delete(this.resource).subscribe(
      () => {
        this.modal.hide();
        this.deleted.emit(this.resource);
      },
      () => {
        this.unableToDelete = true;
      });
  }

}
