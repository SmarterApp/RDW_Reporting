
import { TestBed, inject } from "@angular/core/testing";
import { ColorService } from "./color.service";

describe('ColorService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ColorService
      ]
    });
  });

  it("should transform a number to a color",
    inject([ColorService], (service: ColorService) => {

    expect(service.getColor(987234)).not.toBeNull();
    expect(service.getColor(123)).not.toEqual(service.getColor(124));
  }));
});
