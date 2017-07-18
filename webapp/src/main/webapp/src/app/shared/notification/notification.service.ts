import { Injectable, EventEmitter } from "@angular/core";
import { Notification } from "./notification.model";

/**
 * This service is responsible for displaying notification alerts
 * to the user.
 */
@Injectable()
export class NotificationService {

  public onNotification: EventEmitter<Notification> = new EventEmitter();

  constructor() {
  }

  /**
   * Dispatch a notification message for immediate display.
   *
   * @param notification A notification message
   */
  public showNotification(notification: Notification): void {
    this.onNotification.emit(notification);
  }

}

