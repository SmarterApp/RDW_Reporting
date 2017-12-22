import { BsModalRef } from "ngx-bootstrap";
import { Component, EventEmitter } from "@angular/core";
import { Group } from "./model/group.model";
import { GroupService } from "./groups.service";

@Component({
  selector: 'delete-group-modal',
  templateUrl: './delete-group.modal.html'
})
export class DeleteGroupModalComponent {

  group: Group;
  unableToDelete: boolean = false;
  deleted: EventEmitter<Group> = new EventEmitter();

  constructor(private modal: BsModalRef, private service: GroupService) {
  }

  cancel() {
    this.modal.hide();
  }

  delete() {
    this.service.delete(this.group).subscribe(
      () => {
        this.modal.hide();
        this.deleted.emit(this.group);
      },
      (error) => {
        this.unableToDelete = true;
      });
  }
}
