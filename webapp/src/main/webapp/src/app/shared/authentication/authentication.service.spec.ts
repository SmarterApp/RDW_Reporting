import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import { TestBed, inject } from "@angular/core/testing";
import { AuthenticationService } from "./authentication.service";
import { StorageService, SBStorage, StorageType, WindowRefService } from "@sbac/rdw-reporting-common-ngx";
import { TestModule } from "../../../test/test.module";
import { Router } from "@angular/router";

let mockWindow = {
  location: {
    href: "https://awsqa/groups",
    pathname: "/groups"
  }
};

describe('AuthenticationService', () => {
  let storageService: MockStorageService;


  beforeEach(() => {
    storageService = new MockStorageService();


    TestBed.configureTestingModule({
      imports: [ TestModule ],
      providers: [
        AuthenticationService, {
          provide: StorageService,
          useValue: storageService
        } , {
          provide: WindowRefService,
          useClass: MockWindowsRefService
        }
      ]
    });
  });

  it('should create',
    inject([ AuthenticationService ], (service: AuthenticationService) => {

    expect(service).toBeTruthy();
  }));

  it('should record the browser location on authentication failure',
    inject([ AuthenticationService, Router ], (service: AuthenticationService, router: Router) => {

    service.handleAuthenticationFailure();

    expect(storageService.getStorage).toHaveBeenCalledWith(StorageType.Session);

    let location = service.getReauthenticationLocation();
    expect(location).toBe("https://awsqa/groups");
    expect(router.navigate).toHaveBeenCalledWith(["session-expired"]);
  }));

  it('should never record the browser location of session-expired',
    inject([ AuthenticationService, Router ], (service: AuthenticationService, router: Router) => {

    mockWindow.location.pathname = "/session-expired";
    mockWindow.location.href = "http://awsqa/session-expired";
    service.handleAuthenticationFailure();

    let location = service.getReauthenticationLocation();
    expect(location).toBeUndefined();
    expect(router.navigate).toHaveBeenCalledWith(["session-expired"]);
  }));

  it('should store / as /home to avoid hitting the landing page',
    inject([ AuthenticationService, Router ], (service: AuthenticationService, router: Router) => {

    mockWindow.location.pathname = "/";
    mockWindow.location.href = "http://awsqa/";
    service.handleAuthenticationFailure();

    expect(storageService.getStorage).toHaveBeenCalledWith(StorageType.Session);

    let location = service.getReauthenticationLocation();
    expect(location).toBe("http://awsqa/home");
    expect(router.navigate).toHaveBeenCalledWith(["session-expired"]);
  }));
});

class MockWindowsRefService {
  get nativeWindow() {
    return mockWindow;
  }
}

class MockStorageService {
  getStorage: Spy = createSpy("getStorage");

  private storage: InMemoryStorage = new InMemoryStorage();

  constructor() {
    this.getStorage.and.returnValue(this.storage);
  }
}

class InMemoryStorage implements SBStorage {
  repo: any = {};

  getItem(key: string): string|any {
    return this.repo[key];
  }

  removeItem(key: string): void {
    delete this.repo[key];
  }

  setItem(key: string, data: string): void {
    this.repo[key] = data;
  }
}
