import { TestBed } from '@angular/core/testing';

import { TestResultsAvailabilityService } from './test-results-availability.service';

describe('TestResultsAvailabilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestResultsAvailabilityService = TestBed.get(
      TestResultsAvailabilityService
    );
    expect(service).toBeTruthy();
  });
});
