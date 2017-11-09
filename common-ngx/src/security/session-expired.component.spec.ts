import { SessionExpiredComponent } from "./session-expired.component";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { AuthenticationService } from "./authentication.service";
import { TranslateModule } from "@ngx-translate/core";
import { Location } from "@angular/common";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe('SessionExpiredComponent', () => {
  let component: SessionExpiredComponent;
  let fixture: ComponentFixture<SessionExpiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [ SessionExpiredComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: Location, useClass: MockLocation }
      ]
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
  authenticate: Spy = createSpy("authenticate");
}

class MockLocation {
  prepareExternalUrl: Spy = createSpy("prepareExternalUrl");
}
