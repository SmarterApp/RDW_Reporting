import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../user/model/user.model";

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  user: User;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.user = this.route.snapshot.data[ 'user' ];
  }
}
