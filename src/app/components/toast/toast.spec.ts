import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { Toast } from './toast';
import { ToastService } from '@/app/services/toast.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Toast', () => {
  let component: Toast;
  let fixture: ComponentFixture<Toast>;
  let toastService: ToastService;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toast],
      providers: [ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject ToastService', () => {
    expect(component.toastService).toBe(toastService);
  });

  it('should call markForCheck on init', () => {
    const markForCheckSpy = vi.spyOn(changeDetectorRef, 'markForCheck');
    component.ngOnInit();
    expect(markForCheckSpy).toHaveBeenCalled();
  });

  it('should have empty toasts initially', () => {
    expect(component.toastService.toasts.length).toBe(0);
  });

  it('should display added toasts', () => {
    component.toastService.show('Test message');
    fixture.detectChanges();
    
    expect(component.toastService.toasts.length).toBe(1);
    expect(component.toastService.toasts[0].message).toBe('Test message');
  });

  it('should remove toast when removed from service', () => {
    component.toastService.show('Test message');
    fixture.detectChanges();
    
    expect(component.toastService.toasts.length).toBe(1);
    
    component.toastService.remove(component.toastService.toasts[0]);
    fixture.detectChanges();
    
    expect(component.toastService.toasts.length).toBe(0);
  });
});
