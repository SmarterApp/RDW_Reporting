import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import { inject, TestBed } from "@angular/core/testing";
import {
  AuthenticationService,
  AuthenticationServiceAuthenticationExpiredRoute,
  AuthenticationServiceDefaultAuthenticationRoute
} from "./authentication.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MockActivatedRoute } from "../test/mock.activated-route";
import { MockRouter } from "../test/mock.router";
import { Location } from "@angular/common";
import { WindowRefService } from "../core/window-ref.service";
import { SBStorage, StorageService, StorageType } from "../core/storage.service";

describe('AuthenticationService', () => {
  let storageService: MockStorageService;
  let mockWindow: any;

  beforeEach(() => {
    storageService = new MockStorageService();

    mockWindow = {
      location: {
        href: 'https://awsqa/groups',
        pathname: '/groups'
      }
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Location, useClass: MockLocation },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
        AuthenticationService,
        { provide: AuthenticationServiceAuthenticationExpiredRoute, useValue: 'session-expired' },
        { provide: AuthenticationServiceDefaultAuthenticationRoute, useValue: 'home' },
        { provide: StorageService, useValue: storageService },
        { provide: WindowRefService, useValue: new MockWindowsRefService(mockWindow) }
      ]
    });
  });

  it('should create',
    inject([ AuthenticationService ], (service: AuthenticationService) => {

      expect(service).toBeTruthy();
    }));

  it('should record the browser location on authentication failure',
    inject([ AuthenticationService, Router ], (service: AuthenticationService, router: Router) => {

      service.navigateToAuthenticationExpiredRoute();

      expect(storageService.getStorage).toHaveBeenCalledWith(StorageType.Session);
      expect(service.urlWhenSessionExpired).toBe("https://awsqa/groups");
      expect(router.navigate).toHaveBeenCalledWith([ "session-expired" ]);
    }));

  it('should never record the browser location of session-expired',
    inject([ AuthenticationService, Router ], (service: AuthenticationService, router: Router) => {

      mockWindow.location.pathname = "/session-expired";
      mockWindow.location.href = "http://awsqa/session-expired";
      service.navigateToAuthenticationExpiredRoute();

      expect(service.urlWhenSessionExpired).toBeUndefined();
      expect(router.navigate).toHaveBeenCalledWith([ "session-expired" ]);
    }));

  it('should store / as /home to avoid hitting the landing page',
    inject([ AuthenticationService, Router ], (service: AuthenticationService, router: Router) => {

      mockWindow.location.pathname = "/";
      mockWindow.location.href = "http://awsqa/";
      service.navigateToAuthenticationExpiredRoute();

      expect(storageService.getStorage).toHaveBeenCalledWith(StorageType.Session);
      expect(service.urlWhenSessionExpired).toBe("http://awsqa/home");
      expect(router.navigate).toHaveBeenCalledWith([ "session-expired" ]);
    }));

});

class MockLocation {
  prepareExternalUrl(value: string): string {
    return `${value}`;
  }
}

class MockWindowsRefService {
  constructor(private window: any){}
  get nativeWindow() {
    return this.window;
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

  getItem(key: string): string | any {
    return this.repo[ key ];
  }

  removeItem(key: string): void {
    delete this.repo[ key ];
  }

  setItem(key: string, data: string): void {
    this.repo[ key ] = data;
  }
}
