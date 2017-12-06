import { OnInit } from "@angular/core";
import { InstructionalResourcesService } from "./instructional-resources.service";
import { Component } from "@angular/core";

import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "instructional-resources",
  templateUrl: "instructional-resources.component.html"
})
export class InstructionalResourcesComponent implements OnInit {

  constructor(private service: InstructionalResourcesService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    let user = this.route.snapshot.data[ 'user' ];
    // this.service.getInstructionalResources();
  }


}
