import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Alert, AlertModel } from './alert';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Alert', () => {
  let component: Alert;
  let fixture: ComponentFixture<Alert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alert]
    }).compileComponents();

    fixture = TestBed.createComponent(Alert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept AlertModel data as input', () => {
    const alertData: AlertModel = {
      alertType: 'warning',
      icoType: 'bi-exclamation-octagon-fill',
      message: 'This is a warning message'
    };

    component.data = alertData;
    fixture.detectChanges();

    expect(component.data).toEqual(alertData);
  });

  it('should handle different alert types', () => {
    const alertTypes = ['warning', 'error', 'success', 'info'];

    alertTypes.forEach(type => {
      const alertData: AlertModel = {
        alertType: type,
        icoType: 'bi-icon',
        message: 'Test message'
      };

      component.data = alertData;
      fixture.detectChanges();

      expect(component.data.alertType).toBe(type);
    });
  });

  it('should display alert message', () => {
    const alertData: AlertModel = {
      alertType: 'warning',
      icoType: 'bi-exclamation-octagon-fill',
      message: 'Test message'
    };

    component.data = alertData;
    fixture.detectChanges();

    expect(component.data.message).toBe('Test message');
  });

  it('should have correct icon type', () => {
    const alertData: AlertModel = {
      alertType: 'warning',
      icoType: 'bi-exclamation-octagon-fill',
      message: 'Test message'
    };

    component.data = alertData;
    fixture.detectChanges();

    expect(component.data.icoType).toBe('bi-exclamation-octagon-fill');
  });
});
