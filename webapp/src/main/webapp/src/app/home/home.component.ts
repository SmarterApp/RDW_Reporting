import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { User } from "../user/model/user.model";
import { TranslateService } from "@ngx-translate/core";
import { NotificationService } from "../shared/notification/notification.service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  user: User;
  systemNewsHtml: string;

  constructor(private route : ActivatedRoute, private translate: TranslateService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.user = this.route.snapshot.data[ "user" ];
    this.translate.get('html.system-news').subscribe(result => {
      this.systemNewsHtml = result;
    });
  }

  showComingSoon(featureName: string) {
    this.notificationService.info({id: 'messages.coming-soon', args: { featureName: featureName }, dismissOnTimeout: 5000 });
  }

  showInterpretiveGuideComingSoon() {
    this.notificationService.info({id: 'messages.interpretive-guide-coming-soon', args: { }, dismissOnTimeout: 5000 });
  }
}
