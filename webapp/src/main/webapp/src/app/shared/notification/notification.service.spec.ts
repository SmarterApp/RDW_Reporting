import { NotificationService } from "./notification.service";
import { Notification } from "./notification.model";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import any = jasmine.any;

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  it("should dispatch a notification", (done) => {
    let note: Notification = new Notification("Test Notification");

    let handler = function(notification) {
      expect(notification).toBe(note);
      done();
    };
    service.onNotification.subscribe(handler);

    service.showNotification(note);
  });
});

