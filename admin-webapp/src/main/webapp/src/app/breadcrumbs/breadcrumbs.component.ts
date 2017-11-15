import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router, UrlSegment } from "@angular/router";
import "rxjs/add/operator/filter";
import { Utils } from "@sbac/rdw-reporting-common-ngx";
import * as _ from "lodash";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: Array<any> = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private title: Title, private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(() => {
      let root: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(root);
      let translatedBreadCrumbs = "";
      this.breadcrumbs = this.getBreadcrumbs(root);
      for (let i = this.breadcrumbs.length - 1; i >= 0; i--) {
        if (this.breadcrumbs[ i ].requiresTranslate) {
          translatedBreadCrumbs = translatedBreadCrumbs.concat(this.translateService.instant(this.breadcrumbs[ i ].label, this.breadcrumbs[ i ].translateParams), " < ");
        } else {
          translatedBreadCrumbs = translatedBreadCrumbs.concat(this.breadcrumbs[ i ].label, " < ");
        }
      }
      this.title.setTitle(translatedBreadCrumbs + "Smarter Balanced | Admin");
    });
  }

  private getBreadcrumbs(route: ActivatedRoute, commands: any[] = [], breadcrumbs: any[] = []): any[] {
    let BreadcrumbsKeyword = "breadcrumb";

    let children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (let child of children) {
      if (child.outlet != PRIMARY_OUTLET) {
        continue; // skip
      }

      if (!child.snapshot.data.hasOwnProperty(BreadcrumbsKeyword)) {
        return this.getBreadcrumbs(child, commands, breadcrumbs);
      }

      // Parse the route commands for this route
      let crumbData = child.snapshot.data[ BreadcrumbsKeyword ];
      let route = child.snapshot;
      let urlSegments: UrlSegment[] = route.url;
      urlSegments.forEach(segment => {
        commands.push(segment.path);
        commands.push(segment.parameters);
      });
      let routeCommands = _.clone(commands);

      let requiresTranslate = true;
      let label = crumbData.translate;
      let translateParams = {};

      if (crumbData.resolve) {
        label = Utils.getPropertyValue(crumbData.resolve, child.snapshot.data);
        requiresTranslate = false;
      }

      if (crumbData.translateResolve) {
        translateParams = Utils.getPropertyValue(crumbData.translateResolve, child.snapshot.data);
      }

      let breadcrumb: any = {
        requiresTranslate: requiresTranslate,
        label: label,
        translateParams: translateParams,
        commands: routeCommands
      };

      let existing = breadcrumbs.find(x => _.isEqual(x.commands, breadcrumb.commands));

      if (existing) {
        existing.label = breadcrumb.label;
        existing.translateParams = breadcrumb.translateParams;
      }
      else {
        breadcrumbs.push(breadcrumb);
      }

      //recursive
      return this.getBreadcrumbs(child, commands, breadcrumbs);
    }
  }
}
