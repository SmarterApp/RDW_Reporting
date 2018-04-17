import { computeEffectiveYears } from './support';

describe('computeEffectiveYears', () => {

  it('should compute years backwards based on input grade span', () => {
    expect(computeEffectiveYears(100, ['01', '02', '03'])).toEqual([100, 99, 98]);
  });

  it('should accommodate any order of grade codes', () => {
    expect(computeEffectiveYears(100, ['03', '02', '01'])).toEqual([100, 99, 98]);
  });

  it('should support grade code gaps', () => {
    expect(computeEffectiveYears(100, ['05', '03', '01'])).toEqual([100, 98, 96]);
    expect(computeEffectiveYears(100, ['10', '04', '01'])).toEqual([100, 94, 91]);
  });

});
