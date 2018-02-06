import { Utils } from "./support";

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
});
