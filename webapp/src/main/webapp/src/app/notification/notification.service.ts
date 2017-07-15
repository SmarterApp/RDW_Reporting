import { Injectable, EventEmitter } from "@angular/core";
import { Notification } from "./notification.model";
import { CookieService } from "ngx-cookie";

/**
 * This service is responsible for displaying notification alerts
 * to the user.
 */
@Injectable()
export class NotificationService {
  private cookieName: string = "queuedNotifications";
  private expirationMinutes: number = 30;

  public onNotification: EventEmitter<Notification> = new EventEmitter();

  constructor(private cookieService: CookieService) {
  }

  /**
   * Dispatch a notification message for immediate display.
   *
   * @param notification A notification message
   */
  public showNotification(notification: Notification): void {
    this.onNotification.emit(notification);
  }

  /**
   * Queue a notification for display on next application initialization.
   *
   * @param notification A notification message
   */
  public queueNotification(notification: Notification): void {
    let existing: Notification[] = this.unQueueNotifications();
    existing.push(notification);

    let expiration: Date = new Date();
    expiration.setMinutes(expiration.getMinutes() + this.expirationMinutes);
    this.cookieService.putObject(this.cookieName, existing, {expires: expiration});
  }

  /**
   * Retrieve notifications queued for display on next application initialization.
   * Note that this will purge the queue.
   *
   * @returns {Array} The queued notifications
   */
  public unQueueNotifications(): Notification[] {
    let notifications: Notification[] = this.cookieService.getObject(this.cookieName) as Notification[] || [];
    this.cookieService.remove(this.cookieName);
    return notifications;
  }

}

