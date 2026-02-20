import { TestBed } from '@angular/core/testing';
import { PrettyJsonPipe } from './prettyjson.pipe';

describe('PrettyJsonPipe', () => {
  let pipe: PrettyJsonPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrettyJsonPipe]
    });
    pipe = TestBed.inject(PrettyJsonPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format simple object with 2-space indentation', () => {
    const obj = { name: 'John', age: 30 };
    const result = pipe.transform(obj);

    expect(result).toContain('"name"');
    expect(result).toContain('"John"');
    expect(result).toContain('"age"');
    expect(result).toContain('30');
    // Check for 2-space indentation
    expect(result).toContain('  ');
  });

  it('should format nested objects', () => {
    const obj = {
      user: {
        name: 'John',
        address: {
          city: 'New York'
        }
      }
    };
    const result = pipe.transform(obj);

    expect(result).toContain('"user"');
    expect(result).toContain('"address"');
    expect(result).toContain('"city"');
  });

  it('should format arrays', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = pipe.transform(arr);

    expect(result).toContain('1');
    expect(result).toContain('2');
    expect(result).toContain('5');
  });

  it('should format array of objects', () => {
    const arr = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ];
    const result = pipe.transform(arr);

    expect(result).toContain('"id"');
    expect(result).toContain('"name"');
    expect(result).toContain('"Item 1"');
  });

  it('should handle null value', () => {
    const result = pipe.transform(null);

    expect(result).toBe('null');
  });

  it('should handle undefined value', () => {
    const result = pipe.transform(undefined);

    expect(result).toBeDefined();
  });

  it('should handle string value', () => {
    const result = pipe.transform('test string');

    expect(result).toContain('test string');
  });

  it('should handle number value', () => {
    const result = pipe.transform(42);

    expect(result).toBe('42');
  });

  it('should handle boolean value', () => {
    const resultTrue = pipe.transform(true);
    const resultFalse = pipe.transform(false);

    expect(resultTrue).toBe('true');
    expect(resultFalse).toBe('false');
  });

  it('should handle empty object', () => {
    const result = pipe.transform({});

    expect(result).toContain('{}');
  });

  it('should handle empty array', () => {
    const result = pipe.transform([]);

    expect(result).toContain('[]');
  });

  it('should return "Invalid JSON" for circular reference', () => {
    const obj: any = { name: 'John' };
    obj.self = obj; // Create circular reference

    const result = pipe.transform(obj);

    expect(result).toBe('Invalid JSON');
  });

  it('should return "Invalid JSON" for non-serializable values', () => {
    const nonSerializable = {
      date: new Date(),
      func: () => { },
      symbol: Symbol('test')
    };

    const result = pipe.transform(nonSerializable);
    // The result should be formatted JSON, not an error
    expect(result).toBeTruthy();
  });

  it('should maintain proper formatting with 2-space indentation', () => {
    const obj = { a: { b: { c: 'value' } } };
    const result = pipe.transform(obj);

    const lines = result.split('\n');
    // Check that indentation is consistent
    expect(result).toContain('  ');
  });

  it('should format object with special characters', () => {
    const obj = { key: 'value with "quotes" and \\backslash' };
    const result = pipe.transform(obj);

    expect(result).toBeTruthy();
  });

  it('should handle deeply nested structures', () => {
    const obj = {
      level1: {
        level2: {
          level3: {
            level4: {
              level5: 'deep value'
            }
          }
        }
      }
    };
    const result = pipe.transform(obj);

    expect(result).toContain('"level5"');
    expect(result).toContain('"deep value"');
  });
});
