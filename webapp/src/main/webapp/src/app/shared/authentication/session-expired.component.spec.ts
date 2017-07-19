import { SessionExpiredComponent } from "./session-expired.component";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { AuthenticationService } from "./authentication.service";
import { TranslateModule } from "@ngx-translate/core";
import { Location } from "@angular/common";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;

describe('SessionExpiredComponent', () => {
  let component: SessionExpiredComponent;
  let fixture: ComponentFixture<SessionExpiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [ SessionExpiredComponent ],
      providers: [{
        provide: AuthenticationService,
        useClass: MockAuthenticationService
      }, {
        provide: Location,
        useClass: MockLocation
      }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpiredComponent);
    component = fixture.debugElement.children[ 0 ].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class MockAuthenticationService {
  getReauthenticationLocation: Spy = createSpy("getReauthenticationLocation");
}

class MockLocation {
  prepareExternalUrl: Spy = createSpy("prepareExternalUrl");
}
