// loading.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Observable, isObservable } from 'rxjs';

@Pipe({
  name: 'loading',
  pure: false // Impure so it can update when data arrives
})
export class LoadingPipe implements PipeTransform {
  private latestValue: any = null;
  private loading = true;

  transform(value: any, placeholder: string = 'Loading...'): any {
    if (isObservable(value)) {
      value.subscribe({
        next: (val) => {
          this.latestValue = val;
          this.loading = false;
        },
        error: () => {
          this.latestValue = 'Error loading data';
          this.loading = false;
        }
      });
    } else if (value instanceof Promise) {
      value.then(val => {
        this.latestValue = val;
        this.loading = false;
      }).catch(() => {
        this.latestValue = 'Error loading data';
        this.loading = false;
      });
    } else {
      // Non-async value
      this.latestValue = value;
      this.loading = false;
    }

    return this.loading ? placeholder : this.latestValue;
  }
}
