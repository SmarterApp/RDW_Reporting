import Spy = jasmine.Spy;
import { DefaultLangChangeEvent, LangChangeEvent, TranslationChangeEvent } from "@ngx-translate/core";
import { EventEmitter } from "@angular/core";
import { of } from 'rxjs/observable/of';

export class MockTranslateService {
  instant: Spy = jasmine.createSpy("instant");
  get: Spy = jasmine.createSpy("get");
  onTranslationChange: EventEmitter<TranslationChangeEvent> = new EventEmitter();
  onLangChange: EventEmitter<LangChangeEvent> = new EventEmitter();
  onDefaultLangChange: EventEmitter<DefaultLangChangeEvent> = new EventEmitter();

  constructor() {
    this.instant.and.callFake((key: string | Array<string>) => key);
    this.get.and.callFake((key: string | Array<string>) => of(key));
  }
}
