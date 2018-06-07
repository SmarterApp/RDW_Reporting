import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthorizationService } from './authorization.service';

/**
 * Structural directive that conditionally renders an element if the user has permission to view it.
 *
 * Example usages:
 * <div *hasPermission="'GROUP_WRITE'"></div>
 * <div *hasAnyPermission="['GROUP_WRITE', 'INSTRUCTIONAL_RESOURCE_WRITE']"></div>
 */
@Directive({ selector: '[hasPermission],[hasAnyPermission]' })
export class AuthorizationDirective {

  private displayed: boolean;

  constructor(private authorizationService: AuthorizationService,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {
  }

  /**
   * Will display the view if the user has the provided permission
   *
   * @param {string} permission
   */
  @Input()
  set hasPermission(permission: string) {
    if (!permission) {
      throw new Error('Directive "hasPermission" permission argument must not be null or undefined');
    }
    this.update([ permission ]);
  }

  /**
   * Will display the view if the user has any of the provided permissions
   *
   * @param {string[]} permissions
   */
  @Input()
  set hasAnyPermission(permissions: string[]) {
    if (!permissions || permissions.length === 0) {
      throw new Error('Directive "hasAnyPermission" argument must not be null, undefined or empty');
    }
    this.update(permissions);
  }

  @Input()
  set hasAnyPermissionElse(template) {
    if (!this.displayed) {
      this.viewContainer.createEmbeddedView(template);
    }
  }

  private update(permissions: string[]): void {
    this.authorizationService.hasAnyPermission(permissions)
      .subscribe(hasPermission => {
        if (hasPermission && !this.displayed) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.displayed = true;
        } else if (!hasPermission && this.displayed) {
          this.viewContainer.clear();
          this.displayed = false;
        }
      });
  }
}
