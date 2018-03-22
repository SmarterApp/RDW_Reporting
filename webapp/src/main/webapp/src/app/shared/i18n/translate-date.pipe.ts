import { EventEmitter, Injectable, OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { EmbeddedLanguage } from "./language-settings";
import { isNullOrUndefined } from "util";

/**
 * This date pipe proxies requests to the Angular DatePipe
 * using the currently-selected locale.
 */
@Injectable()
@Pipe({
  name: 'date',
  pure: false //Required to update value on translation change
})
export class TranslateDatePipe implements PipeTransform, OnDestroy {

  private dateDisplay: string = '';
  private lastDate: any;
  private lastPattern: string;

  private onLangChange: EventEmitter<LangChangeEvent>;

  constructor(private translate: TranslateService) {
  }

  public transform(date: any, pattern: string = 'mediumDate'): any {
    if(!date) {
      return '';
    }

    // if we ask another time for the same date, return the last value
    if(date === this.lastDate && pattern === this.lastPattern) {
      return this.dateDisplay;
    }

    // set the value
    this.updateValue(date, pattern);

    // if there is a subscription to onLangChange, clean it
    this.dispose();

    // subscribe to onLangChange event, in case the language changes
    if (!this.onLangChange) {
      this.onLangChange = this.translate.onLangChange.subscribe(() => {
        if (this.lastDate) {
          this.updateValue(this.lastDate, this.lastPattern);
        }
      });
    }

    return this.dateDisplay;
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  private updateValue(date: any, pattern: string): void {
    this.lastDate = date;
    this.lastPattern = pattern;

    let ngPipe: DatePipe;
    try {
      ngPipe = new DatePipe(this.translate.currentLang);
      this.dateDisplay = ngPipe.transform(date, pattern);
    } catch (error) {
      //Locale not available, fall back to the embedded locale
      ngPipe = new DatePipe(EmbeddedLanguage);
      this.dateDisplay = ngPipe.transform(date, pattern);
    }
  }

  private dispose(): void {
    if (!isNullOrUndefined(this.onLangChange)) {
      this.onLangChange.unsubscribe();
      delete this.onLangChange;
    }
  }
}
