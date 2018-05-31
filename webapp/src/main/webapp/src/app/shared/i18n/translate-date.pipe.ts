import { OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { EmbeddedLanguage } from "./language-settings";
import { Subscription } from "rxjs/Subscription";
import { Utils } from "../support/support";

/**
 * This date pipe proxies requests to the Angular DatePipe
 * using the currently-selected locale.
 */
@Pipe({
  name: 'date',
  pure: false //Required to update value on translation change
})
export class TranslateDatePipe implements PipeTransform, OnDestroy {

  private dateDisplay: string = '';
  private currentDate: any;
  private currentPattern: string;

  private onLangChange: Subscription;

  constructor(private translate: TranslateService) {
  }

  public transform(date: any, pattern: string = 'mediumDate'): any {
    if (!date) {
      return '';
    }

    // if we ask another time for the same date, return the last value
    if (date === this.currentDate && pattern === this.currentPattern) {
      return this.dateDisplay;
    }

    // set the value
    this.updateValue(date, pattern);

    // if there is a subscription to onLangChange, clean it
    this.dispose();

    // subscribe to onLangChange event, in case the language changes
    if (!this.onLangChange) {
      this.onLangChange = this.translate.onLangChange.subscribe(() => {
        if (this.currentDate) {
          this.updateValue(this.currentDate, this.currentPattern);
        }
      });
    }

    return this.dateDisplay;
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  private updateValue(date: any, pattern: string): void {
    this.currentDate = date;
    this.currentPattern = pattern;

    try {
      this.dateDisplay = new DatePipe(this.translate.currentLang)
        .transform(date, pattern);
    } catch (error) {
      //Locale not available, fall back to the embedded locale
      this.dateDisplay = new DatePipe(EmbeddedLanguage)
        .transform(date, pattern);
    }
  }

  private dispose(): void {
    if (!Utils.isNullOrUndefined(this.onLangChange)) {
      this.onLangChange.unsubscribe();
      delete this.onLangChange;
    }
  }
}
