import { RdwTranslateLoader } from "./rdw-translate-loader";
import { Http, RequestOptionsArgs, RequestOptions, Response, ResponseOptions } from "@angular/http";
import { Observable } from "rxjs";

let apiObserver;
let uiObserver;

let uiResponse;
let apiResponse;

beforeEach(() =>{
  let apiMockData = { 'welcome.title': 'Hello from api', 'welcome.message': 'The api welcomes you!' };
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

});

describe('RdwTranslateLoader', () => {
  it('should merge api and ui translations', () => {
    let fixture = new RdwTranslateLoader(new MockHttp());
    fixture.getTranslation('en').subscribe(actual => {

      expect(actual['welcome']['title']).toBe('Hello from api');
      expect(actual['welcome']['message']).toBe('The api welcomes you!');
      expect(actual['welcome']['prompt']).toBe('You have been prompted from the UI!');
      expect(actual['labels']['combo-box']).toBe('Select');
    });

    uiObserver.next(uiResponse);
    uiObserver.complete();

    apiObserver.next(apiResponse);
    apiObserver.complete();
  })
});

describe('RdwTranslateLoader', () => {
  it('should fall back to ui translations when no api translations are available', () => {
    let fixture = new RdwTranslateLoader(new MockHttp());
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
  })
});

class MockHttp extends Http {
  constructor() {
    super(null, new RequestOptions());
  }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    let observable;

    observable = url.indexOf('.json') === -1
      ? new Observable(observer => apiObserver = observer)
      : new Observable(observer => uiObserver = observer);

    return observable;
  }
}
