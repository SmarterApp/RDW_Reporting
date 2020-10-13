import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { IsrTemplateService } from './service/isr-template.service';
import { IsrTemplate } from './model/isr-template';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'isr-template-delete-modal',
  templateUrl: './isr-template-delete.modal.html'
})
// tslint:disable-next-line:component-class-suffix
export class IsrTemplateDeleteModal implements OnInit {
  private _subscription: Subscription;
  public deleteTemplateEvent: EventEmitter<any> = new EventEmitter();
  isrTemplate: IsrTemplate = new IsrTemplate();

  // below determine which if any alert need to be displayed
  unableToDelete: boolean;

  constructor(
    private modal: BsModalRef,
    private isrTemplateService: IsrTemplateService,
    private router: Router
  ) {
    this._subscription = router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe(() => {
        this.cancel();
      });
  }

  ngOnInit(): void {
    this.unableToDelete = false;
  }

  cancel() {
    this.modal.hide();
  }

  delete() {
    this.isrTemplateService
      .delete(
        this.isrTemplate.subject.value,
        this.isrTemplate.assessmentType.value
      )
      .subscribe(() => this.deleteSuccessful(), err => this.deleteFailed(err));
  }

  private deleteSuccessful() {
    this.unableToDelete = false;
    this.modal.hide();
    this.deleteTemplateEvent.emit({
      data: true,
      res: 204,
      error: false
    });
  }

  private deleteFailed(err) {
    this.unableToDelete = true;
  }
}
