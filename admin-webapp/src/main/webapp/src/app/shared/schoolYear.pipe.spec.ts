import { async } from "@angular/core/testing";
import { SchoolYearPipe } from "./schoolYear.pipe";

describe('SchoolYearPipe', () => {
  it('should return return the academic year in the correct format', async(() => {
    let target = new SchoolYearPipe();
    let actual = target.transform(2015);

    expect(actual).toBe("2014-15");
  }));

  it('should not attempt to format malformed years', async(() => {
    let target = new SchoolYearPipe();
    let actual = target.transform(15);

    expect(actual).toBe("15");
  }));

});
