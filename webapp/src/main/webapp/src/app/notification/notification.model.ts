import { isNullOrUndefined } from "util";
import * as _ from "lodash";

/**
 * This model represents a notification message.
 */
export class Notification {

  // Default configuration
  public configuration: any = {
    type: "info",
    dismissOnTimeout: 10000,
    dismissible: true
  };

  constructor(public translationKey: string,
              private _configuration?: any) {
    if (!isNullOrUndefined(_configuration)) {
      this.configuration = _.merge(this.configuration, _configuration);
    }
  }
}
