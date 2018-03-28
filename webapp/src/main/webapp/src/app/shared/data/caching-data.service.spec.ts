import { MockDataService } from "../../../test/mock.data.service";
import { inject, TestBed } from "@angular/core/testing";
import { CachingDataService } from "../data/caching-data.service";
import { of } from 'rxjs/observable/of';
import { DataService } from "./data.service";

describe('CachingDataService', () => {
  let dataService: MockDataService;
  let service: CachingDataService;

  beforeEach(() => {
    dataService = new MockDataService();

    TestBed.configureTestingModule({
      providers: [
        CachingDataService,
        {
          provide: DataService,
          useValue: dataService
        }
      ]
    });

  });

  beforeEach(inject([ CachingDataService ], (injectedSvc: CachingDataService) => {
    service = injectedSvc;
  }));

  it('should create', () => {

    expect(service).toBeTruthy();
  });

  it('should handle null options', () => {
    let url = "/user";
    dataService.get.and.callFake((url, options) => {
      expect(url).toBe(`/user`);
      return of({ url });
    });

    service.get(url, null).subscribe((value) => {
      expect(dataService.get).toHaveBeenCalledWith(url, null);
      expect(dataService.get).toHaveBeenCalled();
      expect(value).toEqual({ url: url });
    });
    service.get(url, null).subscribe((value) => {
      expect(dataService.get).toHaveBeenCalledWith(url, null);
      expect(dataService.get).toHaveBeenCalledTimes(1);
      expect(value).toEqual({ url: url });
    });
  });

  it('should handle options', () => {
    let passedUrl: string = "/something";
    let options = {
      params: {
        oneParam: "oneValue"
      }
    };
    dataService.get.and.callFake((url, options) => {
      expect(url).toBe(passedUrl);
      return of({
        url: passedUrl,
        params: options.params
      });
    });

    service.get(passedUrl, options).subscribe((value) => {
      expect(dataService.get).toHaveBeenCalledWith(passedUrl, options);
      expect(dataService.get).toHaveBeenCalled();
      expect(value).toEqual({ url: passedUrl, params: options.params });
    });
    service.get(passedUrl, options).subscribe((value) => {
      expect(dataService.get).toHaveBeenCalledWith(passedUrl, options);
      expect(dataService.get).toHaveBeenCalledTimes(1);
      expect(value).toEqual({ url: passedUrl, params: options.params });
    });
  });

  it('should handle different options', () => {
    let passedUrl: string = "/something";
    let options1 = {
      params: {
        oneParam: "oneValue"
      }
    };

    let options2 = {
      params: {
        twoParam: "twoValue"
      }
    };
    dataService.get.and.callFake((url, options) => {
      expect(url).toBe(passedUrl);
      return of({
        url: passedUrl,
        params: options.params
      });
    });

    service.get(passedUrl, options1).subscribe((value) => {
      expect(dataService.get).toHaveBeenCalledWith(passedUrl, options1);
      expect(dataService.get).toHaveBeenCalled();
      expect(value).toEqual({ url: passedUrl, params: options1.params });
    });
    service.get(passedUrl, options2).subscribe((value) => {
      expect(dataService.get).toHaveBeenCalledWith(passedUrl, options2);
      expect(dataService.get).toHaveBeenCalledTimes(2);
      expect(value).toEqual({ url: passedUrl, params: options2.params });
    });
  });

});
