import { TestBed } from '@angular/core/testing';
import { myFunctionsService } from './myfunctions.service';
import { AlertModel } from '@/app/components';
import { describe, it, expect, beforeEach } from 'vitest';

describe('myFunctionsService', () => {
  let service: myFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [myFunctionsService]
    });
    service = TestBed.inject(myFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAlertWarning', () => {
    it('should return warning alert model', () => {
      const message = 'This is a warning message';

      const result = service.getAlertWarning(message);

      expect(result).toBeTruthy();
      expect(result.alertType).toBe('warning');
      expect(result.icoType).toBe('bi-exclamation-octagon-fill');
      expect(result.message).toBe(message);
    });

    it('should handle empty message', () => {
      const result = service.getAlertWarning('');

      expect(result).toBeTruthy();
      expect(result.alertType).toBe('warning');
      expect(result.message).toBe('');
    });

    it('should handle long message', () => {
      const longMessage = 'A'.repeat(1000);

      const result = service.getAlertWarning(longMessage);

      expect(result.message).toBe(longMessage);
      expect(result.message.length).toBe(1000);
    });

    it('should return AlertModel interface', () => {
      const result = service.getAlertWarning('Test');

      expect(result).toHaveProperty('alertType');
      expect(result).toHaveProperty('icoType');
      expect(result).toHaveProperty('message');
    });
  });
});
