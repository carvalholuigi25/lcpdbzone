import { TestBed } from '@angular/core/testing';
import { ToastService, Toast } from './toast.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should add toast to array', () => {
      const message = 'Test message';
      service.show(message);

      expect(service.toasts.length).toBe(1);
      expect(service.toasts[0].message).toBe(message);
    });

    it('should add toast with options', () => {
      const message = 'Test message';
      const options: Partial<Toast> = { 
        title: 'Test Title', 
        classname: 'success',
        idname: 'toast-1'
      };

      service.show(message, options);

      expect(service.toasts.length).toBe(1);
      expect(service.toasts[0].message).toBe(message);
      expect(service.toasts[0].title).toBe('Test Title');
      expect(service.toasts[0].classname).toBe('success');
      expect(service.toasts[0].idname).toBe('toast-1');
    });

    it('should auto-remove toast after delay', (done: any) => {
      const message = 'Test message';
      const delay = 100;

      service.show(message, { delay });

      expect(service.toasts.length).toBe(1);

      setTimeout(() => {
        expect(service.toasts.length).toBe(0);
        done();
      }, delay + 10);
    });

    it('should add multiple toasts', () => {
      service.show('Toast 1');
      service.show('Toast 2');
      service.show('Toast 3');

      expect(service.toasts.length).toBe(3);
      expect(service.toasts[0].message).toBe('Toast 1');
      expect(service.toasts[1].message).toBe('Toast 2');
      expect(service.toasts[2].message).toBe('Toast 3');
    });
  });

  describe('remove', () => {
    it('should remove specific toast', () => {
      service.show('Toast 1');
      service.show('Toast 2');
      service.show('Toast 3');

      const toastToRemove = service.toasts[1];
      service.remove(toastToRemove);

      expect(service.toasts.length).toBe(2);
      expect(service.toasts[0].message).toBe('Toast 1');
      expect(service.toasts[1].message).toBe('Toast 3');
    });

    it('should handle removing non-existent toast', () => {
      service.show('Toast 1');
      const externalToast: Toast = { message: 'External' };

      service.remove(externalToast);

      expect(service.toasts.length).toBe(1);
      expect(service.toasts[0].message).toBe('Toast 1');
    });
  });

  describe('clear', () => {
    it('should clear all toasts', () => {
      service.show('Toast 1');
      service.show('Toast 2');
      service.show('Toast 3');

      expect(service.toasts.length).toBe(3);

      service.clear();

      expect(service.toasts.length).toBe(0);
    });

    it('should handle clearing empty toasts', () => {
      service.clear();

      expect(service.toasts.length).toBe(0);
    });
  });
});
