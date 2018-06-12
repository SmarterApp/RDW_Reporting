import { async } from "@angular/core/testing";
import { SessionPipe } from './session.pipe';
import Spy = jasmine.Spy;

describe('SessionPipe', () => {
  let target: SessionPipe;
  let translateService;

  beforeEach(async(() => {

    translateService = jasmine.createSpyObj('TranslateService', [
      'instant'
    ]);

    target = new SessionPipe(translateService);

  }));

  it('should return session when it has a value', async(() => {
    let actual = target.transform("abc-123");

    expect(actual).toBe("abc-123");
  }));

  it('should return translated message when null, empty or undefined', async(() => {
    let expectedDisplay = "Not provided";

    (translateService.instant as Spy).and.callFake(() => expectedDisplay);

    expect(target.transform(null)).toEqual(expectedDisplay);
    expect(target.transform('')).toEqual(expectedDisplay);
    expect(target.transform(undefined)).toEqual(expectedDisplay);
  }));

});
