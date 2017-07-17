import { Component, OnInit } from "@angular/core";
import { NotificationService } from "./notification.service";
import { Notification } from "./notification.model";

/**
 * This component is responsible for displaying user notifications.
 */
@Component({
  selector: 'app-notifications',
  templateUrl: './notification.component.html'
})
export class NotificationComponent implements OnInit {

  public notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {
    notificationService.onNotification.subscribe(this.onNotification.bind(this));
  }

  ngOnInit(): void {
    //Display qeued notifications
    this.notificationService.dequeueNotifications().forEach(notification => {
      this.onNotification(notification);
    });
  }

  /**
   * When a notification is dismissed, remove it from the list.
   *
   * @param notification The dismissed notification
   */
  public onDismissed(notification) {
    let idx: number = this.notifications.indexOf(notification);
    if (idx < 0) return;

    this.notifications.splice(idx, 1);
  }

  /**
   * When a notification is received, display it to the user.
   *
   * @param notification A notification
   */
  private onNotification(notification) {
    this.notifications.push(notification);
  }

}
