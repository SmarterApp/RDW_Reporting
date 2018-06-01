import { Component, Input } from "@angular/core";
import { Utils } from "../support/support";

/**
 * This component is responsible for displaying a label with
 * an information popover icon.
 */
@Component({
  selector: 'info-button,[info-button]',
  templateUrl: './information-button.component.html'
})
export class InformationButtonComponent {

  @Input()
  public title: string;

  @Input()
  public content: string;

  @Input()
  public icon: string;

  @Input()
  public placement: string = "top";

  /**
   * Stop propagation of the info button click and dispatch a new click event
   * directly on the document to trigger any global "close" click handlers
   * and prevent displaying multiple info popovers.
   * This is necessary to avoid secondary click effects such as sorting a table
   * when clicking the info button.
   *
   * @param {Event} event The information button click event
   */
  public propagateClick(event: Event): void {
    event.stopPropagation();

    Utils.setImmediate(() => {
      const clickEvent: MouseEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      window.document.dispatchEvent(clickEvent);
    });
  }

}
