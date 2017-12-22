import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { EmbargoConfirmationModal } from "./embargo-confirmation-modal.component";
import { EmbargoToggleEvent } from "./embargo-toggle-event";
import { OrganizationType } from "./organization-type.enum";
import { Embargo } from "./embargo";

@Component({
  selector: 'embargo',
  templateUrl: './embargo.component.html'
})
export class EmbargoComponent {

  private _embargoesByOrganizationType: Map<OrganizationType, Embargo[]>;
  private _modal: BsModalRef;

  constructor(private route: ActivatedRoute,
              private modalService: BsModalService) {
  }

  ngOnInit(): void {
    this._embargoesByOrganizationType = this.route.snapshot.data[ 'embargoesByOrganizationType' ];
  }

  get stateEmbargo() {
    const stateEmbargoes = this._embargoesByOrganizationType.get(OrganizationType.State);
    return stateEmbargoes ? stateEmbargoes[0] : undefined;
  }

  get districtEmbargoes() {
    return this._embargoesByOrganizationType.get(OrganizationType.District);
  }

  /**
   * Opens confirmation modal for the given embargo toggle event
   *
   * @param {EmbargoToggleEvent} event the toggle event
   */
  confirmToggle(event: EmbargoToggleEvent): void {
    this._modal = this.modalService.show(EmbargoConfirmationModal);
    this._modal.content.event = event;
  }

}

