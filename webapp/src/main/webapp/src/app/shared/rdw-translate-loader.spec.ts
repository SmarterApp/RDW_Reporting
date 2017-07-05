import { RdwTranslateLoader } from "./rdw-translate-loader";
import { Http, RequestOptionsArgs, RequestOptions, Response, ResponseOptions } from "@angular/http";
import { Observable } from "rxjs";

let apiMockData;
let uiMockData;

beforeEach(() =>{
  apiMockData = { 'welcome.title': 'Hello from api', 'welcome.message': 'The api welcomes you!' };
  uiMockData = {
    'welcome': {
      'title': 'Hello from UI',
      'message': 'The UI welcomes you!',
      'prompt': 'You have been prompted from the UI!'
    },
    'labels': {
      'combo-box': 'Select'
    }
  };
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
  })
});

describe('RdwTranslateLoader', () => {
  it('should fall back to ui translations when no api translations are available', () => {
    let fixture = new RdwTranslateLoader(new MockHttp());
    apiMockData = {};

    fixture.getTranslation('en').subscribe(actual => {

      expect(actual['welcome']['title']).toBe('Hello from UI');
      expect(actual['welcome']['message']).toBe('The UI welcomes you!');
      expect(actual['welcome']['prompt']).toBe('You have been prompted from the UI!');
      expect(actual['labels']['combo-box']).toBe('Select');
    });
  })
});

class MockHttp extends Http {
  constructor() {
    super(null, new RequestOptions());
  }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    let data;

    if (url.indexOf('.json') === -1) {
      data = apiMockData;
    }
    else {
      data = uiMockData;
    }

    let response = new Response(new ResponseOptions({
      body: JSON.stringify(data)
    }));

    return Observable.of(response);
  }
}
