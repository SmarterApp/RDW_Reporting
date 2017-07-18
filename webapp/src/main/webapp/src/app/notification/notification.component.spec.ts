import { NotificationComponent } from "./notification.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NotificationService } from "./notification.service";
import { NO_ERRORS_SCHEMA, EventEmitter } from "@angular/core";
import { Notification } from "./notification.model";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let service: MockNotificationService;

  beforeEach(() => {
    service = new MockNotificationService();
    TestBed.configureTestingModule({
      imports: [

      ],
      declarations: [ NotificationComponent ],
      providers: [
        {
          provide: NotificationService,
          useValue: service
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display queued notifications', () => {
    let note: Notification = new Notification("A Notification");
    service.dequeueNotifications.and.returnValue([note]);

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.notifications).toContain(note);
  });

  it('should remove dismissed notifications', () => {
    let note: Notification = new Notification("A Notification");

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service.onNotification.emit(note);
    expect(component.notifications).toContain(note);
    component.onDismissed(note);
    expect(component.notifications.length).toBe(0);
  });
});

class MockNotificationService {
  onNotification: EventEmitter<Notification> = new EventEmitter();
  dequeueNotifications: Spy = createSpy("dequeueNotifications");

  constructor() {
    this.dequeueNotifications.and.returnValue([]);
  }
}
