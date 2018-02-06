import { Component, Input } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";


/**
 * This modal component displays an instructional resource creation form.
 */
@Component({
  selector: 'aggregate-report-confirmation-modal',
  templateUrl: './aggregate-report-confirmation.modal.html'
})
export class AggregateReportConfirmationModal {

  @Input()
  rowCount: number;

  @Input()
  accept: Function;

  @Input()
  decline: Function;

  constructor(private modal: BsModalRef){
  }

  onAcceptButtonClick(): void {
    this.modal.hide();
    this.accept && this.accept();
  }

  onDeclineButtonClick(): void {
    this.modal.hide();
    this.decline && this.decline();
  }

}
