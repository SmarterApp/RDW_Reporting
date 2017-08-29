import { NotificationComponent } from "./notification.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NotificationService } from "./notification.service";
import { NO_ERRORS_SCHEMA, EventEmitter } from "@angular/core";
import { Notification } from "./notification.model";
import { TranslateModule } from "@ngx-translate/core";

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let service: MockNotificationService;

  beforeEach(() => {
    service = new MockNotificationService();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
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
}
