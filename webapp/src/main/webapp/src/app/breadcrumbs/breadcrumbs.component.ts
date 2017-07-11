import {Component, OnInit} from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, UrlSegment } from "@angular/router";
import "rxjs/add/operator/filter";
import {Utils} from "../shared/Utils";
import * as _ from "lodash";

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent implements OnInit{
  breadcrumbs : Array<any> = [];

  constructor(private router: Router, private activatedRoute : ActivatedRoute ) {
  }

  ngOnInit(): void {
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(() => {
      let root: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(root);
    });
  }

  private getBreadcrumbs(route: ActivatedRoute, commands: any[]=[], breadcrumbs: any[] = []): any[] {
    let BreadcrumbsKeyword = "breadcrumb";

    let children: ActivatedRoute[] = route.children;
    if (children.length === 0 ) {
      return breadcrumbs;
    }

    for (let child of children) {
      if (child.outlet != PRIMARY_OUTLET ) {
        continue; // skip
      }

      if (!child.snapshot.data.hasOwnProperty(BreadcrumbsKeyword)) {
        return this.getBreadcrumbs(child, commands, breadcrumbs);
      }

      // Parse the route commands for this route
      let crumbData = child.snapshot.data[BreadcrumbsKeyword];
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

      if(crumbData.resolve){
        label = Utils.getPropertyValue(crumbData.resolve, child.snapshot.data);
        requiresTranslate = false;
      }

      if(crumbData.translateResolve){
        translateParams = Utils.getPropertyValue(crumbData.translateResolve, child.snapshot.data);
      }

      let breadcrumb: any = {
        requiresTranslate: requiresTranslate,
        label: label,
        translateParams: translateParams,
        commands: routeCommands
      };

      let existing = breadcrumbs.find(x => _.isEqual(x.commands, breadcrumb.commands));

      if(existing) {
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
