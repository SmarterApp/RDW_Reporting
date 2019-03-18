import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

/**
 * Simple modal wrapper around the printable report form
 */
@Component({
  selector: 'delete-modal',
  templateUrl: './delete-modal.component.html'
})
export class DeleteModalComponent {
  @Input()
  name: string;

  @Input()
  messageId: string = 'delete-modal.body';

  @Output()
  deleted: EventEmitter<void> = new EventEmitter();

  constructor(private modalReference: BsModalRef) {}

  onCloseButtonClick(): void {
    this.modalReference.hide();
  }

  onCancelButtonClick(): void {
    this.modalReference.hide();
  }

  onDeleteButtonClick(): void {
    this.modalReference.hide();
    this.deleted.emit();
  }
}