import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { User } from "../user/model/user.model";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  user : User;
  systemNewsHtml: string;

  constructor(private route : ActivatedRoute, private translate: TranslateService) { }

  ngOnInit() {
    this.user = this.route.snapshot.data[ "user" ];
    this.translate.get('html.system-news').subscribe(result => {
      this.systemNewsHtml = result;
    });
  }

}
