import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router } from "@angular/router";
import "rxjs/add/operator/filter";
import * as _ from "lodash";
import { TranslateService } from "@ngx-translate/core";
import { Utils } from "../support/support";

export const BreadCrumbsRouteDataKey = 'breadcrumb';
export const BreadCrumbsTitleDelimiter = ' < ';

/**
 * Interface for defining breadcrumbs in the route data param.
 *
 * Example usages:
 * data: { breadcrumb: { translate: 'code' } }
 * data: { breadcrumb: { translate: 'path.to.property', translateResolve: 'path.to.property.holder.in.route.data' } }
 * data: { breadcrumb: { resolve: 'path.to.property.in.route.data' }
 */
export interface BreadcrumbOptions {
  translate?: string;
  translateResolve?: string;
  resolve?: string;
}

/**
 * Represents a breadcrumb in the navigation path
 */
export interface Breadcrumb {

  /**
   * Display name of the path segment
   */
  text: string;

  /**
   * routeLink directive parameters
   * This is an array of the following format: ['/path', param, '/path', param]
   *
   * @see @angular/router/RouterLink
   */
  routerLinkParameters: any[];
}

@Component({
  selector: 'breadcrumbs',
  template: `
    <div [hidden]="breadcrumbs.length == 0">
      <div class="container">
        <ul class="breadcrumb">
          <li>
            <a routerLink="/">
              <i class="fa fa-home"></i> <span class="sr-only">{{ 'labels.home.name' | translate }}</span>
            </a>
          </li>
          <li *ngFor="let crumb of breadcrumbs; let last = last;" [ngClass]="{'active': last }">
            <a *ngIf="!last" [routerLink]="crumb.routerLinkParameters">{{ crumb.text }}</a>
            <span *ngIf="last" [routerLink]="crumb.routerLinkParameters">{{ crumb.text }}</span>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class Breadcrumbs implements OnInit {

  private _breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private title: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  get breadcrumbs(): Breadcrumb[] {
    return this._breadcrumbs;
  }

  set breadcrumbs(values: Breadcrumb[]) {
    if (this._breadcrumbs !== values) {
      this._breadcrumbs = values;
      this.title.setTitle(this.createTitle(values));
    }
  }

  private createBreadcrumbs(route: ActivatedRoute, routerLinkParameters: any[] = [], breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {

    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (let child of children) {
      if (child.outlet != PRIMARY_OUTLET) {
        continue;
      }

      const route = child.snapshot;

      if (!route.data.hasOwnProperty(BreadCrumbsRouteDataKey)) {
        return this.createBreadcrumbs(child, routerLinkParameters, breadcrumbs);
      }

      const breadcrumbOptions: BreadcrumbOptions = route.data[ BreadCrumbsRouteDataKey ];

      route.url.forEach(segment => {
        routerLinkParameters.push(segment.path);
        routerLinkParameters.push(segment.parameters);
      });

      const breadcrumb = this.createBreadcrumb(breadcrumbOptions, route.data, routerLinkParameters.concat());
      const existing = breadcrumbs.find(existing => _.isEqual(existing.routerLinkParameters, breadcrumb.routerLinkParameters));

      if (existing) {
        existing.text = breadcrumb.text;
      } else {
        breadcrumbs.push(breadcrumb);
      }

      return this.createBreadcrumbs(child, routerLinkParameters, breadcrumbs);
    }
  }

  private createBreadcrumb(options: BreadcrumbOptions, routeData: any, routerLinkParameters: any[]): Breadcrumb {
    if (options.translate) {
      let text = options.translateResolve
        ? this.translateService.instant(options.translate, Utils.getPropertyValue(options.translateResolve, routeData))
        : this.translateService.instant(options.translate);

      return {
        text: text,
        routerLinkParameters: routerLinkParameters
      }
    }
    if (options.resolve) {
      return {
        text: Utils.getPropertyValue(options.resolve, routeData),
        routerLinkParameters: routerLinkParameters
      }
    }
    throw new Error('Invalid route breadcrumb options. You must provide a "translate" or "resolve" property.');
  }

  private createTitle(breadcrumbs: any[]): string {
    return breadcrumbs
      .concat()
      .reverse()
      .map(breadcrumb => breadcrumb.text)
      .concat(this.translateService.instant('common-ngx.application.window-title'))
      .join(BreadCrumbsTitleDelimiter);
  }

}
