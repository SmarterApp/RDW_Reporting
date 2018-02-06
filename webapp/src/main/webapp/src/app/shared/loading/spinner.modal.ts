import { Component } from "@angular/core";
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from "@angular/router";

/**
 * Loading spinner that displays on route changes
 */
@Component({
  selector: 'spinner-modal',
  templateUrl: 'spinner.modal.html'
})
export class SpinnerModal {

  loading: boolean = false;

}
