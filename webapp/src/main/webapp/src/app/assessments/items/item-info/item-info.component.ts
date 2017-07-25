import { Component, OnInit, Input } from "@angular/core";
import { AssessmentItem } from "../../model/assessment-item.model";
import { UserService } from "../../../user/user.service";

@Component({
  selector: 'item-info',
  templateUrl: './item-info.component.html'})
export class ItemInfoComponent implements OnInit {

  @Input()
  item: AssessmentItem;

  interpretiveGuide: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.interpretiveGuide = user.configuration.interpretiveGuide
    })
  }

}
