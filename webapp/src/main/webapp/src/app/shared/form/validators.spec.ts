import { computeEffectiveYears } from '../../aggregate-report/support';
import { withinBounds } from './validators';

describe('withinBounds', () => {

  it('should return null when effective school years are within available school years ', () => {
    expect(withinBounds(4, ['01', '02', '03'], 1, 'fail').call(this)).toBeNull();
  });

  it('should handle noncontiguous assessment grades ', () => {
    expect(withinBounds(4, ['01', '04'], 1, 'fail').call(this)).toBeNull();
  });

  it('should return properties when out of bounds ', () => {
    expect(withinBounds(4, ['01', '10'], 1, 'fail').call(this)).toEqual({withinBounds: 'fail'});
  });

});
