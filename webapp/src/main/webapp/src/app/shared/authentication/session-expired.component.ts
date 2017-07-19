import { Component } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { Location } from "@angular/common";

@Component({
  selector: 'session-expired',
  templateUrl: './session-expired.component.html',
})
export class SessionExpiredComponent {

  constructor(private authenticationService: AuthenticationService,
              private location: Location) {}

  /**
   * On OK, navigate the browser to their previous route with a full browser refresh.
   * If a previous route is not available, navigate the user to the home page.
   */
  onOk(): void {
    let location = this.authenticationService.getReauthenticationLocation();
    if (!location) {
      location = this.location.prepareExternalUrl("");
    }
    window.location.href = location;
  }
}
