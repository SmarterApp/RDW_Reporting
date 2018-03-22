import { OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DecimalPipe } from "@angular/common";
import { EmbeddedLanguage } from "./language-settings";
import { isNullOrUndefined } from "util";
import { Subscription } from "rxjs/Subscription";

/**
 * This number pipe proxies requests to the Angular DecimalPipe
 * using the currently-selected locale.
 */
@Pipe({
  name: 'number',
  pure: false
})
export class TranslateNumberPipe implements PipeTransform, OnDestroy {

  private numberDisplay: string = '';
  private currentNumber: any;
  private currentFormat: string;

  private onLangChange: Subscription;

  constructor(private translate: TranslateService) {
  }

  public transform(value: any, format: string): any {
    if (isNullOrUndefined(value)) {
      return '';
    }

    // if we ask another time for the same date, return the last value
    if (value === this.currentNumber && format === this.currentFormat) {
      return this.numberDisplay;
    }

    // set the value
    this.updateValue(value, format);

    // if there is a subscription to onLangChange, clean it
    this.dispose();

    // subscribe to onLangChange event, in case the language changes
    if (!this.onLangChange) {
      this.onLangChange = this.translate.onLangChange.subscribe(() => {
        if (!isNullOrUndefined(this.currentNumber)) {
          this.updateValue(this.currentNumber, this.currentFormat);
        }
      });
    }

    return this.numberDisplay;
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  private updateValue(value: any, format: string): void {
    this.currentNumber = value;
    this.currentFormat = format;

    let ngPipe: DecimalPipe;
    try {
      ngPipe = new DecimalPipe(this.translate.currentLang);
      this.numberDisplay = ngPipe.transform(value, format);
    } catch (error) {
      //Locale not available, fall back to the embedded locale
      ngPipe = new DecimalPipe(EmbeddedLanguage);
      this.numberDisplay = ngPipe.transform(value, format);
    }
  }

  private dispose(): void {
    if (!isNullOrUndefined(this.onLangChange)) {
      this.onLangChange.unsubscribe();
      delete this.onLangChange;
    }
  }
}
