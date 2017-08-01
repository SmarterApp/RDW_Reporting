import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { User } from "../user/model/user.model";
import { TranslateService } from "@ngx-translate/core";
import { Notification } from "../shared/notification/notification.model";
import { NotificationService } from "../shared/notification/notification.service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  user : User;
  systemNewsHtml: string;

  constructor(private route : ActivatedRoute, private translate: TranslateService, private notifService: NotificationService) { }

  ngOnInit() {
    this.user = this.route.snapshot.data[ "user" ];
    this.translate.get('html.system-news').subscribe(result => {
      this.systemNewsHtml = result;
    });
  }

  showComingSoon(featureName: string) {
    let notif = new Notification('messages.coming-soon',  {dismissOnTimeout: 5000 });
    notif.messageObject = { featureName: featureName };

    this.notifService.showNotification(notif);
  }
}
