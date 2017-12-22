import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { User } from "../../user/model/user.model";

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  user: User;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.user = this.route.snapshot.data[ 'user' ];
  }

}
