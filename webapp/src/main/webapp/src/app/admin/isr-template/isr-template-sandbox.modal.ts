import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'isr-template-sandbox-modal',
  templateUrl: 'isr-template-sandbox.modal.html'
})
export class IsrTemplateSandboxModal {
  private _subscription: Subscription;

  sandboxUploadMessage: boolean;

  constructor(private modal: BsModalRef, private router: Router) {
    this._subscription = router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe(() => {
        this.close();
      });
  }

  close() {
    this.modal.hide();
  }
}
