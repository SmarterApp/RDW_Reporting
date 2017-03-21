import {Component, Input} from "@angular/core";
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent {

  private crumbs: Array<any> = [];

  constructor(private translate: TranslateService) {
  }

  @Input()
  set values(values: Array<any>) {
    this.translate.get('labels.home').subscribe(homeValue => {
      this.translate.get('labels.groups').subscribe(groupValue => {
        this.crumbs = [{path: '/', name: homeValue}, {path:'/groups', name: groupValue }].concat(values);
      })
    });
  }

}
