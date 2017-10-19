import { async } from '@angular/core/testing';
import { SubjectPipe } from './subject.pipe';
import { TranslateService } from "@ngx-translate/core";
import Spy = jasmine.Spy;

describe('SubjectPipe', () => {
  let translate = jasmine.createSpyObj("TranslateService", [ "instant" ]);
  translate.instant = function(value) {
    if(value == "enum.subject.MATH")
      return "Math";
    else if (value == "enum.subject.ELA")
      return "ELA";

    throw Error("Unexpected translate value");
  };

  it('should return all for subject of null', async(() => {
    let target = new SubjectPipe(translate);
    let actual = target.transform(null);

    expect(actual).toBe("Math, ELA");
  }));

  it('should return MATH for subjectId of MATH', async(() => {
    let target = new SubjectPipe(translate);
    let actual = target.transform("MATH");

    expect(actual).toBe("Math");
  }));

  it('should return ELA for subjectId of ELA', async(() => {
    let target = new SubjectPipe(translate);
    let actual = target.transform("ELA");

    expect(actual).toBe("ELA");
  }));
});
