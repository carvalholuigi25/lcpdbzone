import { TestBed } from '@angular/core/testing';
import { LoadingPipe } from './loading.pipe';
import { of, Subject } from 'rxjs';

describe('LoadingPipe', () => {
  let pipe: LoadingPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingPipe]
    });
    pipe = TestBed.inject(LoadingPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should show loading placeholder for Observable', () => {
    const observable = new Subject();
    const placeholder = 'Loading data...';

    const result = pipe.transform(observable, placeholder);

    expect(result).toBe(placeholder);
  });

  it('should display value when Observable emits', () => {
    const testData = { id: 1, name: 'Test' };
    const observable = of(testData);

    setTimeout(() => {
      const result = pipe.transform(observable);
      expect(result).toEqual(testData);
    }, 100);
  });

  it('should show loading placeholder for Promise', () => {
    const promise = new Promise(resolve => {
      setTimeout(() => resolve({ data: 'test' }), 100);
    });

    const result = pipe.transform(promise, 'Loading...');

    expect(result).toBe('Loading...');
  });

  it('should display value when Promise resolves', () => {
    const testData = { data: 'test' };
    const promise = Promise.resolve(testData);

    setTimeout(() => {
      const result = pipe.transform(promise);
      expect(result).toEqual(testData);
    }, 50);
  });

  it('should handle Promise rejection', () => {
    const promise = Promise.reject(new Error('Test error'));

    setTimeout(() => {
      const result = pipe.transform(promise);
      expect(result).toBe('Error loading data');
    }, 50);
  });

  it('should handle non-async values directly', () => {
    const value = 'Plain value';

    const result = pipe.transform(value);

    expect(result).toBe('Plain value');
  });

  it('should use default placeholder when none provided', () => {
    const observable = new Subject();

    const result = pipe.transform(observable);

    expect(result).toBe('Loading...');
  });

  it('should handle custom placeholders', () => {
    const observable = new Subject();
    const customPlaceholder = 'Please wait...';

    const result = pipe.transform(observable, customPlaceholder);

    expect(result).toBe(customPlaceholder);
  });

  it('should handle array as non-async value', () => {
    const array = [1, 2, 3];

    const result = pipe.transform(array);

    expect(result).toEqual(array);
  });

  it('should handle object as non-async value', () => {
    const obj = { key: 'value' };

    const result = pipe.transform(obj);

    expect(result).toEqual(obj);
  });

  it('should handle null as non-async value', () => {
    const result = pipe.transform(null);

    expect(result).toBeNull();
  });

  it('should handle undefined as non-async value', () => {
    const result = pipe.transform(undefined);

    expect(result).toBeUndefined();
  });
});
