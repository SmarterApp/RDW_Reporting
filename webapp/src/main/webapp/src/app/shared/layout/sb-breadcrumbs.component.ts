import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router
} from '@angular/router';
import { isEqual } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../support/support';
import { filter, map, takeUntil } from 'rxjs/operators';
import { combineLatest, Observable, Subject } from 'rxjs';

export const BreadCrumbsRouteDataKey = 'breadcrumb';
export const BreadCrumbsTitleDelimiter = ' < ';

/**
 * Interface for defining breadcrumbs in the route data param.
 *
 * Example usages:
 * data: { breadcrumb: { translate: 'code' } }
 * data: { breadcrumb: { translate: 'path.to.property', translateResolve: 'path.to.property.holder.in.route.data' } }
 * data: { breadcrumb: { resolve: 'path.to.property.in.route.data' }

 * @deprecated use {@link BreadcrumbFactory}
 */
export interface BreadcrumbOptions {
  translate?: (translateResolve?: any) => string | string;
  translateResolve?: string;
  translateParameters?: (translateResolve?: any) => any;
  resolve?: string;
}

export interface BreadcrumbContext {
  /**
   * Resolve data or router link parameters
   */
  route: ActivatedRouteSnapshot;

  /**
   * The translate service
   */
  translateService: TranslateService;
}

/**
 * Factory method for generating breadcrumb text
 */
export type BreadcrumbFactory = (context: BreadcrumbContext) => string;

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

function createBreadcrumbs(
  route: ActivatedRouteSnapshot,
  translateService: TranslateService,
  routerLinkParameters: any[] = [],
  breadcrumbs: Breadcrumb[] = []
): Breadcrumb[] {
  const children: ActivatedRouteSnapshot[] = route.children;
  if (children.length === 0) {
    return breadcrumbs;
  }

  for (let child of children) {
    if (child.outlet != PRIMARY_OUTLET) {
      continue;
    }

    if (!child.data.hasOwnProperty(BreadCrumbsRouteDataKey)) {
      return createBreadcrumbs(
        child,
        translateService,
        routerLinkParameters,
        breadcrumbs
      );
    }

    const breadcrumbOptions: BreadcrumbOptions =
      child.data[BreadCrumbsRouteDataKey];

    child.url.forEach(segment => {
      routerLinkParameters.push(segment.path);
      routerLinkParameters.push(segment.parameters);
    });

    const breadcrumb = createBreadcrumb(
      breadcrumbOptions,
      child,
      routerLinkParameters.concat(),
      translateService
    );
    const existing = breadcrumbs.find(existing =>
      isEqual(existing.routerLinkParameters, breadcrumb.routerLinkParameters)
    );

    if (existing) {
      existing.text = breadcrumb.text;
    } else {
      breadcrumbs.push(breadcrumb);
    }

    return createBreadcrumbs(
      child,
      translateService,
      routerLinkParameters,
      breadcrumbs
    );
  }
}

function createBreadcrumb(
  options: BreadcrumbOptions | BreadcrumbFactory,
  route: ActivatedRouteSnapshot,
  routerLinkParameters: any[],
  translateService: TranslateService
): Breadcrumb {
  const routeData = route.data;
  if (typeof options === 'function') {
    return {
      text: options({
        route,
        translateService
      }),
      routerLinkParameters
    };
  } else {
    if (options.translate != null) {
      const translateResolve =
        options.translateResolve != null
          ? Utils.getPropertyValue(options.translateResolve, routeData)
          : undefined;

      const translate =
        typeof options.translate === 'function'
          ? options.translate(translateResolve)
          : options.translate;

      const translateParameters =
        options.translateParameters != null
          ? options.translateParameters(translateResolve)
          : {};

      return {
        text: translateService.instant(translate, translateParameters),
        routerLinkParameters
      };
    }
    if (options.resolve) {
      return {
        text: Utils.getPropertyValue(options.resolve, routeData),
        routerLinkParameters: routerLinkParameters
      };
    }
  }

  throw new Error(
    'Invalid route breadcrumb options. You must provide a "translate" or "resolve" property.'
  );
}

function createTitle(
  breadcrumbs: Breadcrumb[],
  translateService: TranslateService
): string {
  return breadcrumbs
    .concat()
    .reverse()
    .map(breadcrumb => breadcrumb.text)
    .concat(translateService.instant('common-ngx.breadcrumbs.window-title'))
    .join(BreadCrumbsTitleDelimiter);
}

@Component({
  selector: 'sb-breadcrumbs',
  template: `
    <ng-container *ngIf="(breadcrumbs$ | async) as breadcrumbs">
      <div [hidden]="breadcrumbs.length === 0">
        <div class="container">
          <ul class="breadcrumb">
            <li>
              <a routerLink="/">
                <i class="fa fa-home fa-lg"></i>
                <span class="sr-only">{{
                  'common-ngx.breadcrumbs.home-sr' | translate
                }}</span>
              </a>
            </li>
            <li
              *ngFor="let crumb of breadcrumbs; let last = last"
              [ngClass]="{ active: last }"
            >
              <a *ngIf="!last" [routerLink]="crumb.routerLinkParameters">{{
                crumb.text
              }}</a>
              <span *ngIf="last">{{ crumb.text }}</span>
            </li>
          </ul>
        </div>
      </div>
    </ng-container>
  `
})
export class SbBreadcrumbs implements OnInit, OnDestroy {
  breadcrumbs$: Observable<Breadcrumb[]>;
  private _destroyed: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.breadcrumbs$ = combineLatest(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
      this.translateService.onLangChange
    ).pipe(
      takeUntil(this._destroyed),
      map(() =>
        createBreadcrumbs(
          this.activatedRoute.snapshot.root,
          this.translateService
        )
      )
    );

    this.breadcrumbs$
      .pipe(map(breadcrumbs => createTitle(breadcrumbs, this.translateService)))
      .subscribe(title => {
        this.title.setTitle(title);
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
