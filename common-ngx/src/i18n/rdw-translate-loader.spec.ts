import { RdwTranslateLoader } from "./rdw-translate-loader";
import { Http, RequestOptions, RequestOptionsArgs, Response, ResponseOptions } from "@angular/http";
import { Observable } from "rxjs";
import Spy = jasmine.Spy;

describe('RdwTranslateLoader', () => {

  let apiObserver;
  let uiObserver;

  let uiResponse;
  let apiResponse;

  let mockHttp: Http;

  beforeEach(() =>{
    let apiMockData = {
      'welcome': {
        'title': 'Hello from API',
        'message': 'The API welcomes you!'
      }
    };
    let uiMockData = {
      'welcome': {
        'title': 'Hello from UI',
        'message': 'The UI welcomes you!',
        'prompt': 'You have been prompted from the UI!'
      },
      'labels': {
        'combo-box': 'Select'
      }
    };

    apiResponse = new Response(new ResponseOptions({
      body: JSON.stringify(apiMockData)
    }));

    uiResponse = new Response(new ResponseOptions({
      body: JSON.stringify(uiMockData)
    }));

    mockHttp = new Http(null, new RequestOptions());
    let getMethod: Spy = spyOn(mockHttp, "get");
    getMethod.and.callFake((url: string, options?: RequestOptionsArgs): Observable<any> => {
      let observable;

      observable = url.indexOf('.json') === -1
        ? new Observable(observer => apiObserver = observer)
        : new Observable(observer => uiObserver = observer);

      return observable;
    });
  });

  it('should merge api and ui translations', () => {
    let fixture = new RdwTranslateLoader(mockHttp);
    fixture.getTranslation('en').subscribe(actual => {

      expect(actual['welcome']['title']).toBe('Hello from API');
      expect(actual['welcome']['message']).toBe('The API welcomes you!');
      expect(actual['welcome']['prompt']).toBe('You have been prompted from the UI!');
      expect(actual['labels']['combo-box']).toBe('Select');
    });

    uiObserver.next(uiResponse);
    uiObserver.complete();

    apiObserver.next(apiResponse);
    apiObserver.complete();
  });

  it('should fall back to ui translations when no api translations are available', () => {
    let fixture = new RdwTranslateLoader(mockHttp);
    let response = new Response(new ResponseOptions({
      body: JSON.stringify({})
    }));

    fixture.getTranslation('en').subscribe(actual => {

      expect(actual['welcome']['title']).toBe('Hello from UI');
      expect(actual['welcome']['message']).toBe('The UI welcomes you!');
      expect(actual['welcome']['prompt']).toBe('You have been prompted from the UI!');
      expect(actual['labels']['combo-box']).toBe('Select');
    });

    apiObserver.next(response);
    apiObserver.complete();

    uiObserver.next(uiResponse);
    uiObserver.complete();
  });

});

