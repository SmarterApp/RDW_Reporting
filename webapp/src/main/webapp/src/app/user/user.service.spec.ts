import { UserService } from "./user.service";
import { TestBed, inject } from "@angular/core/testing";
import { CachingDataService } from "../shared/data/caching-data.service";
import { of } from 'rxjs/observable/of';

let userStub: any = {
  firstName: "Bob",
  lastName: "Mack",
  permissions: [ "ALL_STATES_READ" ]
};
let mockDataService = {
  get: () => of(userStub)
};

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: CachingDataService, useValue: mockDataService }
        ]
    });
  });

  it('should create a user service.',
    inject([ UserService ], (userService) => {
      expect(userService).toBeDefined();
    }));

  it('should get user info.',
    inject([ UserService ], (userService) => {
      userService.getUser().subscribe(actual => {
        expect(actual.firstName).toBe(userStub.firstName);
        expect(actual.lastName).toBe(userStub.lastName);
        expect(actual.permissions.length).toBe(userStub.permissions.length);
      })
    }));

});
