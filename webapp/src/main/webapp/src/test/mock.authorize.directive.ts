import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import Spy = jasmine.Spy;

@Directive({ selector: '[sbAuthorize]' })
export class MockAuthorizeDirective {

  public doAuthorize: Spy = jasmine.createSpy("sbAuthorize");

  constructor(private _templateRef: TemplateRef<any>,
              private _viewContainer: ViewContainerRef) {
    this.doAuthorize.and.returnValue(true)
  }

  @Input()
  set sbAuthorize(permissions: string[]) {
    if (this.doAuthorize(permissions)) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainer.clear();
    }
  }

}
