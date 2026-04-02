// safehtml.pipe.ts
import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value || typeof value !== 'string') {
      return '';
    }
    // Sanitize and mark as safe HTML
    return this.sanitizer.bypassSecurityTrustHtml(value) || this.sanitizer.sanitize(SecurityContext.HTML, value) || '';
  }
}
