import { Component, OnInit } from '@angular/core';
import { TranslateService } from "ng2-translate";
import { DataService } from "../shared/data.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'admin-search',
  templateUrl: './admin-search.component.html'
})
export class AdminSearchComponent implements OnInit {

  private content: any;
  private students;
  private group;
  private searchTerm : string;
  private breadcrumbs = [];

  constructor(private translate: TranslateService, private service : DataService, private route : ActivatedRoute, private router : Router) { }

  ngOnInit() {

    this.translate.get('labels.search').subscribe( (searchContent) => {
      this.content = searchContent;
      this.route.queryParams.subscribe( res => {
        this.searchTerm = res['q'];
        if(this.searchTerm) {
          this.search(this.searchTerm);
          this.breadcrumbs = [{name: this.content.results }];
        }
        else{
          this.breadcrumbs = [];
          this.students = undefined;
        }
      });
    })
  }

  goToSearchPage(searchTerm : string) {
      this.router.navigate(['/search'], { queryParams: { q: searchTerm } });
  }

  search(searchTerm : string){
    this.service.getStudents({ ssid: searchTerm })
      .subscribe(res => {
        this.students = res.students;
        this.group = res.group;
      });
  }
}
