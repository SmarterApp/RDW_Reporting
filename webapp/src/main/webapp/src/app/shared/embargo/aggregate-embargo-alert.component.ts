import { Component } from '@angular/core';
import { AggregateEmbargoService } from './aggregate-embargo.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'aggregate-embargo-alert',
  templateUrl: 'embargo-alert.component.html'
})
// tslint:disable-next-line:component-class-suffix
export class AggregateEmbargoAlert {
  // Visibility of this alert, which will be calculated based on user's permissions and embargo status
  // for all results.
  show$: Observable<boolean>;

  constructor(private service: AggregateEmbargoService) {
    this.show$ = this.service.isEmbargoed().pipe();
  }
}
