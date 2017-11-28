import Spy = jasmine.Spy;
import { Observable } from "rxjs/Observable";
import { TranslationChangeEvent, LangChangeEvent, DefaultLangChangeEvent } from "@ngx-translate/core";
import { EventEmitter } from "@angular/core";

export class MockTranslateService {
  instant: Spy = jasmine.createSpy("instant");
  get: Spy = jasmine.createSpy("get");
  onTranslationChange: EventEmitter<TranslationChangeEvent> = new EventEmitter();
  onLangChange: EventEmitter<LangChangeEvent> = new EventEmitter();
  onDefaultLangChange: EventEmitter<DefaultLangChangeEvent> = new EventEmitter();

  constructor() {
    this.instant.and.callFake((key: string | Array<string>) => key);
    this.get.and.callFake((key: string | Array<string>) => Observable.of(key));
  }
}
