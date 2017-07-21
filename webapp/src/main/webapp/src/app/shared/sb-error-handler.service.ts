import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { Response } from "@angular/http";
import { AuthenticationService } from "./authentication/authentication.service";

/**
 * This custom error handler is where all application errors are eventually handled
 * if not intercepted by services.
 */
@Injectable()
export class SBErrorHandler extends ErrorHandler {

  constructor(private injector: Injector) {
    super();
  }

  /**
   * Handle an error.  If the error represents an authentication failure, pass it off to the
   * authentication service for handling.
   *
   * @param error An error
   */
  handleError(error: any): void {
    if (this.isUnauthenticated(error)) {
      let authService: AuthenticationService = this.injector.get(AuthenticationService);
      setTimeout(() => authService.handleAuthenticationFailure(), 0);
    } else {
      super.handleError(error);
    }
  }

  private isUnauthenticated(error: any): boolean {
    return (error instanceof Response && error.status == 401) ||
      (error && error.rejection instanceof Response && error.rejection.status == 401);
  }
}
