import { Utils } from './support';

describe('Utils', () => {

  it('should pass isNullOrUndefined', () => {
    expect(Utils.isNullOrUndefined(null)).toEqual(true);
    expect(Utils.isNullOrUndefined(undefined)).toEqual(true);
    expect(Utils.isNullOrUndefined('')).toEqual(false);
    expect(Utils.isNullOrUndefined('asdf')).toEqual(false);
  });

  it('should pass isUndefined', () => {
    expect(Utils.isUndefined(null)).toEqual(false);
    expect(Utils.isUndefined(undefined)).toEqual(true);
    expect(Utils.isUndefined('asdf')).toEqual(false);
  });

  it('should pass isNullOrEmpty', () => {
    expect(Utils.isNullOrEmpty(null)).toEqual(true);
    expect(Utils.isNullOrEmpty(undefined)).toEqual(true);
    expect(Utils.isNullOrEmpty('')).toEqual(true);
    expect(Utils.isNullOrEmpty('asdf')).toEqual(false);
  });

  it('should create correct filename appendOrIncrementFileNameSuffix', () => {
    expect(Utils.appendOrIncrementFileNameSuffix('an aggregateReport')).toEqual('an aggregateReport (1)');
    expect(Utils.appendOrIncrementFileNameSuffix('an aggregateReport (1)')).toEqual('an aggregateReport (2)');
  });

  it('should pass insertIfNotPresent', () => {
      const array = [ 'a', 'b', 'c' ];
      const array1 = Array.from(array);
      Utils.insertIfNotPresent(array, 'b');
      expect(array1).toEqual(array);

      Utils.insertIfNotPresent(array, 'd');
      expect(array).toEqual([ 'a', 'b', 'c', 'd' ]);
    }
  );
});
