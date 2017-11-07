import { Injectable } from '@angular/core';

export function getWindow(): any {
  return window;
}

/**
 * WindowRefService that creates a layer of abstraction so that
 * the native js window object can be mocked in unit tests.
 */
@Injectable()
export class WindowRefService {
  get nativeWindow(): any {
    return getWindow();
  }
}
