import { Component } from "@angular/core";
import { AuthenticationService } from "./authentication.service";

@Component({
  selector: 'session-expired',
  template: `
    <div>
      <h3 class="blue mb-md">{{'common-ngx.session-expired.title' | translate}}</h3>
      <div class="well">
        <p>{{'common-ngx.session-expired.message' | translate}}</p>
        <button class="btn btn-primary" (click)="onOk()">
          <span>{{'common-ngx.session-expired.ok' | translate}}</span>
        </button>
      </div>
    </div>
  `
})
export class SessionExpiredComponent {

  constructor(private authenticationService: AuthenticationService) {}

  /**
   * On OK, navigate the browser to their previous route with a full browser refresh.
   * If a previous route is not available, navigate the user to the home page.
   */
  onOk(): void {
    this.authenticationService.authenticate();
  }

}
