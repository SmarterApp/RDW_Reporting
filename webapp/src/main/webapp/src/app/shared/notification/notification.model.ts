import { isNullOrUndefined } from "util";
import * as _ from "lodash";

/**
 * This model represents a notification message.
 */
export class Notification {

  // Default configuration
  public configuration: any = {
    type: "info",               //['success'|'info'|'warning'|'danger']
    dismissOnTimeout: 10000,
    dismissible: true
  };

  // Notification title translation key
  public titleKey: string;

  // Notification message translation key
  public messageKey: string;

  public messageObject: any = {};

  constructor(private _translationKey: string,
              private _configuration?: any) {
    this.messageKey = _translationKey;
    if (!isNullOrUndefined(_configuration)) {
      this.configuration = _.merge(this.configuration, _configuration);
    }
  }
}
