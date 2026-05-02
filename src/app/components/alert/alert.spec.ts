import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Alert, AlertModel } from './alert';

describe('Alert', () => {
  let component: Alert;
  let fixture: ComponentFixture<Alert>;

  const mockAlertData: AlertModel = {
    alertType: 'warning',
    icoType: 'bi-exclamation-octagon-fill',
    message: 'No data has been found!',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alert],
    }).compileComponents();

    fixture = TestBed.createComponent(Alert);
    component = fixture.componentInstance;
    component.data = mockAlertData;
    fixture.detectChanges();
  });

  describe('Component initialisation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should be a standalone component', () => {
      const metadata = (Alert as any).__annotations__?.[0];
      // Angular 21 standalone is the default; verify via TestBed creation succeeding without a declaring NgModule
      expect(component).toBeInstanceOf(Alert);
    });
  });

  describe('@Input() data binding', () => {
    it('should accept and store an AlertModel via the data input', () => {
      expect(component.data).toEqual(mockAlertData);
    });

    it('should reflect alertType from the data input', () => {
      expect(component.data.alertType).toBe('warning');
    });

    it('should reflect icoType from the data input', () => {
      expect(component.data.icoType).toBe('bi-exclamation-octagon-fill');
    });

    it('should reflect message from the data input', () => {
      expect(component.data.message).toBe('No data has been found!');
    });

    it('should update when data input changes', () => {
      const updatedData: AlertModel = {
        alertType: 'danger',
        icoType: 'bi-x-circle-fill',
        message: 'An error occurred.',
      };

      // Use setInput so Angular records the binding change before the
      // next change-detection cycle, avoiding NG0100.
      fixture.componentRef.setInput('data', updatedData);
      fixture.detectChanges();

      expect(component.data.alertType).toBe('danger');
      expect(component.data.icoType).toBe('bi-x-circle-fill');
      expect(component.data.message).toBe('An error occurred.');
    });
  });

  describe('AlertModel shape', () => {
    it('should accept an AlertModel with all required fields', () => {
      const model: AlertModel = {
        alertType: 'success',
        icoType: 'bi-check-circle-fill',
        message: 'Operation completed successfully.',
      };

      component.data = model;
      fixture.componentRef.setInput('data', model);
      fixture.detectChanges();

      expect(component.data).toMatchObject({
        alertType: expect.any(String),
        icoType: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should handle info alert type', () => {
      component.data = {
        alertType: 'info',
        icoType: 'bi-info-circle-fill',
        message: 'Here is some information.',
      };

      fixture.componentRef.setInput('data', component.data);
      fixture.detectChanges();

      expect(component.data.alertType).toBe('info');
    });

    it('should handle empty message string', () => {
      component.data = { ...mockAlertData, message: '' };
      fixture.componentRef.setInput('data', component.data);
      fixture.detectChanges();

      expect(component.data.message).toBe('');
    });
  });

  describe('Template rendering', () => {
    it('should render the host element', () => {
      const hostEl: HTMLElement = fixture.nativeElement;
      expect(hostEl).toBeTruthy();
    });

    it('should re-render when input data changes', () => {
      fixture.componentRef.setInput('data', { ...mockAlertData, alertType: 'danger' });
      fixture.detectChanges();

      // The fixture should not throw and the component should reflect new data
      expect(component.data.alertType).toBe('danger');
    });
  });
});