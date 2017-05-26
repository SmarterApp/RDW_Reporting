import { Input, Directive, ViewContainerRef, TemplateRef } from "@angular/core";
import { UserService } from "./user.service";

/*
  Structural directive that removes element from the DOM should
  the user not have at least one of the specified permissions.

  @Input: an array of permissions in which a user must have at least one of to view the content.

  Example usage: <div *sbAuthorize="['GROUP_UPDATE', 'GROUP_UPDATE']"></div>
 */
@Directive({ selector: '[sbAuthorize]' })
export class AuthorizeDirective {
  private _hasView;

  constructor(
    private _userService : UserService,
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef) { }

  @Input()
  set sbAuthorize(permissions: string[]) {
    if(!permissions || permissions.length == 0 )
      throw new Error("Specify at least one permission to authorize against.")

    this._userService.doesCurrentUserHaveAtLeastOnePermission(permissions).subscribe(hasPermission => {
      if(hasPermission && !this._hasView){
        this._viewContainer.createEmbeddedView(this._templateRef);
        this._hasView = true;
      }
      else if(!hasPermission && this._hasView) {
        this._viewContainer.clear();
        this._hasView = false;
      }
    });
  }
}
