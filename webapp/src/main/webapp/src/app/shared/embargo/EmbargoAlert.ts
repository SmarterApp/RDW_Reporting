import { Observable } from 'rxjs';
import { Embargo } from './embargo';

export class EmbargoAlert {
  // Visibility of this alert.
  show$: Observable<Embargo>;

  getMessageKey(embargo: Embargo) {
    if (!embargo) {
      return '';
    } else if (embargo.Loading && embargo.Reviewing) {
      return 'embargo-alert.mixed-message';
    } else if (embargo.Loading) {
      return 'embargo-alert.loading-message';
    } else if (embargo.Reviewing) {
      return 'embargo-alert.reviewing-message';
    }

    return '';
  }

  showMessage(embargo: Embargo) {
    return embargo && (embargo.Loading || embargo.Reviewing);
  }
}
