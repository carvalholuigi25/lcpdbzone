import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'prettyJson' })
export class PrettyJsonPipe implements PipeTransform {
  transform(value: any): string {
    try {
      return JSON.stringify(value, null, 2); // 2 spaces indentation
    } catch {
      return 'Invalid JSON';
    }
  }
}
