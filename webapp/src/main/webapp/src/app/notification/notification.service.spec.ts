import { CookieService } from "ngx-cookie";
import { NotificationService } from "./notification.service";
import { Notification } from "./notification.model";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import any = jasmine.any;

describe('NotificationService', () => {
  let service: NotificationService;
  let cookieService: any;
  let cookieCache: any;

  beforeEach(() => {
    cookieService = {};
    cookieService.getObject = createSpy("getObject");
    cookieService.putObject = createSpy("putObject");
    cookieService.remove = createSpy("remove");

    cookieCache = {};
    cookieService.getObject.and.callFake((key) => {
      return cookieCache[key];
    });
    cookieService.putObject.and.callFake((key, object) => {
      cookieCache[key] = object;
    });
    cookieService.remove.and.callFake((key) => {
      delete cookieCache[key];
    });

    service = new NotificationService(cookieService as CookieService);
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

  it("should queue notifications in a cookie", () => {
    let noteA: Notification = new Notification("Test Notification");
    service.queueNotification(noteA);
    expect(cookieService.putObject).toHaveBeenCalledWith("queuedNotifications", [noteA], any(Object));

    let noteB: Notification = new Notification("Test Notification 2");
    service.queueNotification(noteB);
    expect(cookieService.putObject).toHaveBeenCalledWith("queuedNotifications", [noteA, noteB], any(Object));

    expect(service.dequeueNotifications()).toContain(noteA, noteB);
    expect(service.dequeueNotifications().length).toBe(0);
  });
});

