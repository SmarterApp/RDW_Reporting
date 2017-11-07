import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService, StorageType, WindowRefService } from "@sbac/rdw-reporting-common-ngx";

/**
 * This service is responsible for handling authentication errors.
 */
@Injectable()
export class AuthenticationService {

  private locationKey: string = "authFailureLocation";
  private window: any;

  constructor(private router: Router,
              private storageService: StorageService,
              windowRefService: WindowRefService,) {
    this.window = windowRefService.nativeWindow;
  }

  /**
   * On authentication failure, navigate the user to the session-timeout route.
   */
  handleAuthenticationFailure(): void {
    let urlToStore = this.window.location.href;

    // If the url was the root, navigate to home instead so the user doesn't get the
    // landing page.
    if (this.window.location.pathname === "/") {
      urlToStore += "home";
    }

    // Prevent looping of session-expired page.
    if (urlToStore.indexOf("session-expired") === -1) {
      this.storageService
        .getStorage(StorageType.Session)
        .setItem(this.locationKey, urlToStore);
    }

    this.router.navigate([ "session-expired" ]);
  }

  /**
   * Retrieve the user's url at the time of authentication failure.
   *
   * @returns {string|null} A url
   */
  getReauthenticationLocation(): string {
    return this.storageService.getStorage(StorageType.Session)
      .getItem(this.locationKey);
  }
}
