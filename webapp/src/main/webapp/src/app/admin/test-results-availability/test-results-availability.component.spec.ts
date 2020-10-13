import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResultsAvailabilityComponent } from './test-results-availability.component';
import { BsModalService } from 'ngx-bootstrap';
import { TestResultsAvailabilityService } from './service/test-results-availability.service';

xdescribe('TestResultsAvailabilityComponent', () => {
  let modalService: BsModalService;
  let testResultsService: TestResultsAvailabilityService;
  let component: TestResultsAvailabilityComponent;
  let fixture: ComponentFixture<TestResultsAvailabilityComponent>;

  beforeEach(async(() => {
    modalService = jasmine.createSpyObj('BsModalService', ['show']);
    testResultsService = jasmine.createSpyObj('TestResultsService', [
      'findAll'
    ]);

    TestBed.configureTestingModule({
      declarations: [TestResultsAvailabilityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResultsAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should change', () => {
    expect(component).toBeTruthy();
  });
});
