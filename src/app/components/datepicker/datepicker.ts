import { Component, Input, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgbModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="datepicker-wrapper">
      <label *ngIf="label" [for]="inputId" class="form-label">
        <i *ngIf="iconClass" [classList]="'me-2 ' + iconClass"></i>
        {{ label }}
      </label>
      <div class="input-group">
        <input
          [id]="inputId"
          class="form-control"
          placeholder="Select a date..."
          [formControl]="dateControl"
          ngbDatepicker
          #dp="ngbDatepicker"
          [disabled]="disabled"
          (change)="onDateChange()"
        />
        <button
          type="button"
          class="btn btn-outline-secondary"
          (click)="dp.toggle()"
          [disabled]="disabled"
        >
          <i class="bi bi-calendar-event"></i>
        </button>
      </div>
      <small *ngIf="hint" class="form-text text-muted d-block mt-2">
        {{ hint }}
      </small>
      <div *ngIf="showError && error" class="text-danger small mt-2">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .datepicker-wrapper {
      width: 100%;
    }

    .input-group {
      display: flex;
      gap: 0;
    }

    .form-control {
      flex: 1;
    }

    .btn-outline-secondary {
      border-left: 0;
      padding: 0.375rem 0.75rem;
    }

    .form-label {
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
  `]
})
export class DatepickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() label: string = '';
  @Input() iconClass: string = '';
  @Input() hint: string = '';
  @Input() disabled: boolean = false;
  @Input() inputId: string = 'datepicker-' + Math.random().toString(36).substr(2, 9);
  @Input() minDate: any = null;
  @Input() maxDate: any = null;
  @Input() showError: boolean = false;

  dayAdditional: number = 1;

  dateControl = new FormControl<NgbDateStruct | null>(null);
  error: string = '';

  private onTouched: () => void = () => {};
  private onChange: (value: any) => void = () => {};
  private valueSub: Subscription | null = null;

  ngOnInit() {
    this.dateControl.statusChanges.subscribe(() => {
      this.updateError();
    });

    // propagate value changes (e.g., when user selects a date from the popup)
    this.valueSub = this.dateControl.valueChanges.subscribe((v) => {
      const value = v as NgbDateStruct | null;
      if (value) {
        const d = new Date(value.year, value.month - 1, value.day+this.dayAdditional);
        this.onChange(d.toISOString());
      } else {
        this.onChange(null);
      }
    });
  }

  ngOnDestroy() {
    // cleanup subscriptions
    if (this.valueSub) {
      this.valueSub.unsubscribe();
      this.valueSub = null;
    }
  }

  writeValue(value: any): void {
    if (!value) {
      this.dateControl.setValue(null, { emitEvent: false });
      return;
    }

    // Accept ISO string, Date or NgbDateStruct
    if (typeof value === 'string') {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        this.dateControl.setValue({ year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }, { emitEvent: false });
        return;
      }
    }

    if (value instanceof Date) {
      this.dateControl.setValue({ year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate() }, { emitEvent: false });
      return;
    }

    // assume it's already an NgbDateStruct-like object
    this.dateControl.setValue(value as NgbDateStruct, { emitEvent: false });
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.dateControl.disable({ emitEvent: false });
    } else {
      this.dateControl.enable({ emitEvent: false });
    }
  }

  onDateChange(): void {
    const value = this.dateControl.value as NgbDateStruct | null;
    if (value) {
      const d = new Date(value.year, value.month - 1, value.day+this.dayAdditional);
      this.onChange(d.toISOString());
    } else {
      this.onChange(null);
    }

    this.onTouched();
    this.updateError();
  }

  private updateError(): void {
    const control = this.dateControl;
    if (control.hasError('required')) {
      this.error = 'This field is required';
    } else {
      this.error = '';
    }
  }
}
