import { Injectable } from '@angular/core';
import { BaseRequestOptions, Headers } from '@angular/http';

/**
 * Adds no-cache headers to all async http requests
 */
@Injectable()
export class DataRequestOptions extends BaseRequestOptions {
  headers = new Headers({
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
    'If-Modified-Since': '0'
  });
}
