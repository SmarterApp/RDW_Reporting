import { Component, EventEmitter } from "@angular/core";
import { InstructionalResource } from "./model/instructional-resource.model";
import { BsModalRef } from "ngx-bootstrap";
import { InstructionalResourceService } from "./instructional-resource.service";
import * as _ from "lodash";

/**
 * This modal component displays an instructional resource update form.
 */
@Component({
  selector: 'update-instructional-resource-modal',
  templateUrl: './update-instructional-resource.modal.html'
})
export class UpdateInstructionalResourceModal {

  get resource(): InstructionalResource {
    return this._resource;
  }

  set resource(value: InstructionalResource) {
    this._resource = _.clone(value);
  }

  unableToModify: boolean = false;
  updated: EventEmitter<InstructionalResource> = new EventEmitter();

  private _resource: InstructionalResource = new InstructionalResource();

  constructor(private modal: BsModalRef,
              private resourceService: InstructionalResourceService) {
  }

  cancel() {
    this.modal.hide();
  }

  update() {
    this.resourceService.update(this.resource).subscribe(
      (updatedResource) => {
        this.modal.hide();
        this.updated.emit(updatedResource);
      },
      () => {
        this.unableToModify = true;
      });
  }

}
