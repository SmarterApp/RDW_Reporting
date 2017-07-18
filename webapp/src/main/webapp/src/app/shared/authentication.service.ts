import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService, StorageType } from "./storage.service";

/**
 * This service is responsible for handling authentication errors.
 */
@Injectable()
export class AuthenticationService {

  private locationKey: string = "authFailureLocation";

  constructor(private router: Router,
              private storageService: StorageService) {
  }

  /**
   * On authentication failure, navigate the user to the session-timeout route.
   */
  handleAuthenticationFailure(): void {
    this.storageService.getStorage(StorageType.Session)
      .setItem(this.locationKey,  window.location.href);
    this.router.navigate(["session-expired"]);
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
