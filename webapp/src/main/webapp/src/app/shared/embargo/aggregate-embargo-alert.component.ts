import { Component } from '@angular/core';
import { AggregateEmbargoService } from './aggregate-embargo.service';
import { EmbargoAlert } from './EmbargoAlert';

@Component({
  selector: 'aggregate-embargo-alert',
  templateUrl: 'embargo-alert.component.html'
})
// tslint:disable-next-line:component-class-suffix
export class AggregateEmbargoAlert extends EmbargoAlert {
  constructor(private service: AggregateEmbargoService) {
    super();
    this.show$ = this.service.isEmbargoed().pipe();
  }
}
