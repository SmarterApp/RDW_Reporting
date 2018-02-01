import { OptionalPipe } from "./optional.pipe";

describe('OptionalPipe', () => {
  let pipe: OptionalPipe;

  beforeEach(() => {
    pipe = new OptionalPipe();
  });

  it('should return value', () => {
    expect(pipe.transform(10, undefined, undefined)).toEqual(10);
  });

  it('should return displayValue', () => {
    expect(pipe.transform(10, 2.5, undefined)).toEqual(2.5);
  });

  it('should return default missing value', () => {
    expect(pipe.transform(null, undefined, undefined)).toEqual('-');
  });

  it('should return missing value', () => {
    expect(pipe.transform(null, 2.5, 'empty')).toEqual('empty');
  });
});
