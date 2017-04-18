import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, NavigationEnd, PRIMARY_OUTLET} from "@angular/router";
import "rxjs/add/operator/filter";
import {Utils} from "../shared/Utils"

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent implements OnInit{
  private breadcrumbs : Array<any> = [];

  constructor(private router: Router, private activatedRoute : ActivatedRoute ) {
  }

  ngOnInit(): void {
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      let root: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(root);
    });
  }

  private getBreadcrumbs(route: ActivatedRoute, url: string="", breadcrumbs: any[] = []): any[] {
  let BreadcrumbsKeyword = "breadcrumb";
  let ResolveKeyword = "[resolve]=";

    let children: ActivatedRoute[] = route.children;
    if (children.length === 0 ) {
      return breadcrumbs;
    }

    for (let child of children) {
      if (child.outlet != PRIMARY_OUTLET ) {
        continue; // skip
      }

      if (!child.snapshot.data.hasOwnProperty(BreadcrumbsKeyword) || child.snapshot.data[BreadcrumbsKeyword] == '' ) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      let crumbLabel = child.snapshot.data[BreadcrumbsKeyword]
      let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");
      url += `/${routeURL}`;

      if(crumbLabel.startsWith(ResolveKeyword)){
        let resolveable = crumbLabel.replace(ResolveKeyword, "");
        crumbLabel = Utils.getPropertyValue(resolveable, child.snapshot.data);
      }

      let breadcrumb: any  = {
        label: crumbLabel,
        params: child.snapshot.params, // not being used at this time.
        url: url.replace(/\/$/, "")
      };

      let existing = breadcrumbs.find(x => x.url == breadcrumb.url);

      if(existing)
        existing.label = breadcrumb.label;
      else
        breadcrumbs.push(breadcrumb);

      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
  }
}
