import { computeEffectiveYears } from '../../aggregate-report/support';
import { withinBounds } from './validators';
import { AbstractControl } from '@angular/forms';

describe('withinBounds', () => {

  it('should return null when effective school years are within available school years ', () => {
    expect(withinBounds(4,  1, 'fail')(<AbstractControl>{value: ['01', '02', '03']})).toBeNull();
  });

  it('should handle noncontiguous assessment grades ', () => {
    expect(withinBounds(4, 1, 'fail')(<AbstractControl>{value: ['01', '04']})).toBeNull();
  });

  it('should return properties when out of bounds ', () => {
    expect(withinBounds(4, 1, 'fail')(<AbstractControl>{value: ['01', '10']})).toEqual({withinBounds: 'fail'});
  });

});
