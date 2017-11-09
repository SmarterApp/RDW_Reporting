import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { StorageService, StorageType, WindowRefService } from "../core";

export const AuthenticationServiceDefaultAuthenticationRoute = new InjectionToken<string>('AuthenticationServiceDefaultAuthenticationRoute');
export const AuthenticationServiceAuthenticationExpiredRoute = new InjectionToken<string>('AuthenticationServiceAuthenticationExpiredRoute');

/**
 * This service is responsible for handling authentication
 */
@Injectable()
export class AuthenticationService {

  private urlWhenSessionExpiredKey: string = 'urlWhenSessionExpired';
  private window: any;

  constructor(private router: Router,
              private location: Location,
              private storageService: StorageService,
              windowRefService: WindowRefService,
              @Optional() @Inject(AuthenticationServiceAuthenticationExpiredRoute) private authenticationExpiredRoute: string,
              @Optional() @Inject(AuthenticationServiceDefaultAuthenticationRoute) private defaultAuthenticationRoute: string) {
    this.window = windowRefService.nativeWindow;
  }

  /**
   * Call this on authentication failure.
   * This will navigate the user to the session-timeout route.
   */
  navigateToAuthenticationExpiredRoute(): void {
    let url = this.window.location.href;

    // In the case the the root URL is reserved for public pages.
    // Store the prefered default authentication route instead of the root URL.
    if (this.defaultAuthenticationRoute && this.window.location.pathname === '/') {
      url += this.defaultAuthenticationRoute;
    }

    // Prevents looping of the session-expired page when a authenticate() is called
    if (url.indexOf(this.authenticationExpiredRoute) === -1) {
      this.urlWhenSessionExpired = url;
    }

    this.router.navigate([ this.authenticationExpiredRoute ]);
  }

  /**
   * Authenticates the user by navigating them to a URL where authentication is triggered
   */
  authenticate(): void {
    this.window.location.href = this.authenticationUrl;
  }

  /**
   * The URL needed for authentication.
   * This will be a qualified URL to path "/" or "/{defaultAuthenticationRoute}" if a default authentication route is configured.
   *
   * @returns {string}
   */
  private get authenticationUrl(): string {
    let url = this.urlWhenSessionExpired;
    if (!url) {
      return this.location.prepareExternalUrl('/' + (this.defaultAuthenticationRoute || ''));
    }
    return url;
  }

  /**
   * The url at the time of authentication failure.
   *
   * @returns {string|null} A url
   */
  get urlWhenSessionExpired(): string {
    return this.storageService.getStorage(StorageType.Session).getItem(this.urlWhenSessionExpiredKey);
  }

  set urlWhenSessionExpired(value: string) {
    this.storageService.getStorage(StorageType.Session).setItem(this.urlWhenSessionExpiredKey, value);
  }

}
