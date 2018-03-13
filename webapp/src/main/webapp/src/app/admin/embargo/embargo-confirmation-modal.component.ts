import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";
import { EmbargoService } from "./embargo.service";
import { EmbargoToggleEvent } from "./embargo-toggle-event";
import { EmbargoScope } from "./embargo-scope.enum";
import { OrganizationType } from "./organization-type.enum";
import { finalize } from 'rxjs/operators';

/**
 * Confirmation modal displayed to confirm whether the user wants to make an embargo setting change or not
 */
@Component({
  selector: 'embargo-confirmation-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{content.header | translate: content.parameters}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="modal.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{content.stateDescription | translate: content.parameters}}</p>
      <p>{{content.commandDescription | translate: content.parameters}}</p>
    </div>
    <div class="modal-footer">
      <div class="pull-right">
        <button class="btn btn-xs btn-default" (click)="modal.hide()">{{content.decline | translate: content.parameters}}</button>
        <button class="btn btn-xs btn-primary" (click)="accept()">{{content.accept | translate: content.parameters}}
        </button>
      </div>
    </div>
  `
})
export class EmbargoConfirmationModal {

  /**
   * The event that triggered the modal
   */
  private _event: EmbargoToggleEvent;

  /**
   * Re-computed when the event triggering the modal changes
   */
  content: EmbargoConfirmationModalContent = <EmbargoConfirmationModalContent>{};

  constructor(public modal: BsModalRef,
              private embargoService: EmbargoService) {
  }

  get event(): EmbargoToggleEvent {
    return this._event;
  }

  set event(event: EmbargoToggleEvent) {
    this._event = event;
    this.content = this.createContent(event);
  }

  accept() {
    const { embargo, scope, value, toggle } = this.event;

    // apply desired embargo setting via the API
    this.embargoService.update(embargo, scope, value)
      .pipe(
        finalize(() => {
          this.modal.hide();
        })
      )
      .subscribe(() => {

        // reflect new embargo setting in the UI
        if (scope === EmbargoScope.Individual) {
          embargo.individualEnabled = value;
        } else {
          embargo.aggregateEnabled = value;
        }
        toggle.value = value;
      });
  }

  private createContent(event: EmbargoToggleEvent): EmbargoConfirmationModalContent {

    const [ stateEmbargo, stateEnabled ] = event.embargo.organization.type === OrganizationType.State
      ? [ event.embargo, event.embargoEnabled ]
      : [ event.overridingEmbargo, event.overridingEmbargoEnabled ];

    return {
      header: `embargo-confirmation-modal.header.${event.scope}`,
      stateDescription: `embargo-confirmation-modal.state-description.${event.scope}.${stateEnabled}`,
      commandDescription: `embargo-confirmation-modal.command-description.${event.embargo.organization.type}.${event.scope}.${event.value}`,
      accept: `embargo-confirmation-modal.accept.${event.value}`,
      decline: `embargo-confirmation-modal.decline`,
      parameters: {
        stateName: stateEmbargo.organization.name,
        organizationName: event.embargo.organization.name,
        resultCount: Object.keys(event.embargo.examCountsBySubject)
          .reduce((count, key) => count + event.embargo.examCountsBySubject[ key ], 0)
      }
    };
  }

}

/**
 * Holds translation codes and parameters necessary to present the modal
 */
export class EmbargoConfirmationModalContent {

  header?: string;
  stateDescription?: string;
  commandDescription?: string;
  accept?: string;
  decline?: string;
  parameters?: any;

}
