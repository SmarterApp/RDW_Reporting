import { TestModule } from '../../test/test.module';
import { inject, TestBed } from '@angular/core/testing';
import { AssessmentCardComponent } from './assessment-card.component';
import { ColorService } from '../shared/color.service';

describe('AssessmentCardComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule
      ],
      providers: [
        AssessmentCardComponent,
        { provide: ColorService, useClass: MockColorService }
      ]
    });
  });

  it('should create',
    inject([ AssessmentCardComponent ], (builder: AssessmentCardComponent) => {
      expect(builder).toBeTruthy();
    }));
});

class MockColorService {

}
