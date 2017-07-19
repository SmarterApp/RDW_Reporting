import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import { TestBed, inject } from "@angular/core/testing";
import { AuthenticationService } from "./authentication.service";
import { StorageService, SBStorage, StorageType } from "../storage.service";
import { TestModule } from "../../../test/test.module";
import { Router } from "@angular/router";

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
    expect(location).not.toBeNull();
    expect(location.length).toBeGreaterThan(0);
    expect(router.navigate).toHaveBeenCalledWith(["session-expired"]);
  }));

});

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
