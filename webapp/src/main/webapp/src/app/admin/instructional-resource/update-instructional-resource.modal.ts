import { Component, EventEmitter, OnDestroy } from "@angular/core";
import { InstructionalResource } from "./model/instructional-resource.model";
import { BsModalRef } from "ngx-bootstrap";
import { InstructionalResourceService } from "./instructional-resource.service";
import * as _ from "lodash";
import { NavigationStart, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { filter } from 'rxjs/operators';

/**
 * This modal component displays an instructional resource update form.
 */
@Component({
  selector: 'update-instructional-resource-modal',
  templateUrl: './update-instructional-resource.modal.html'
})
export class UpdateInstructionalResourceModal implements OnDestroy {

  get resource(): InstructionalResource {
    return this._resource;
  }

  set resource(value: InstructionalResource) {
    this._resource = _.clone(value);
  }

  unableToModify: boolean = false;
  updated: EventEmitter<InstructionalResource> = new EventEmitter();

  private _resource: InstructionalResource = new InstructionalResource();
  private _subscription: Subscription;

  constructor(private modal: BsModalRef,
              private resourceService: InstructionalResourceService,
              private router: Router) {
    this._subscription = router.events.pipe(
      filter(e => e instanceof NavigationStart)
    ).subscribe(() => {
      this.cancel();
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
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
