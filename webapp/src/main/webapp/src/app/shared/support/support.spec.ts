import { stripRouteParameters, Utils } from './support';

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

});

describe('stripRouteParameters', () => {

  it('should return null if given null', () => {
    expect(stripRouteParameters(null)).toBe(null);
  });

  it('should return empty if the url if empty', () => {
    expect(stripRouteParameters('')).toBe('');
  });

  it('should return input when there are no tailing params', () => {
    expect(stripRouteParameters('/')).toBe('/');
  });

  it('should return input when there are no tailing params', () => {
    expect(stripRouteParameters('/fragment')).toBe('/fragment');
  });

  it('should return input when there is child path without tailing params', () => {
    expect(stripRouteParameters('/fragment/fragments')).toBe('/fragment/fragments');
  });

  it('should strip tailing params', () => {
    expect(stripRouteParameters('/fragment/fragments;param=1')).toBe('/fragment/fragments');
  });

  it('should strip only tailing params', () => {
    expect(stripRouteParameters('/a;param1=1/fragments;param2=2')).toBe('/a;param1=1/fragments');
  });

  it('should preserve query string', () => {
    expect(stripRouteParameters('/a;param1=1/fragments;param2=2?query=something')).toBe('/a;param1=1/fragments?query=something');
  });

});
