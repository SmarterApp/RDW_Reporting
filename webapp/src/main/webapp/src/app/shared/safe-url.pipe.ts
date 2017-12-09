import { DomSanitizer } from '@angular/platform-browser'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value) {
    return this.sanitized.bypassSecurityTrustUrl(value);
  }
}
