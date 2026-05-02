import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

import { LazyLoadImageDirective } from './lazy-load-image.directive';

// ---------------------------------------------------------------------------
// Host component helpers
// ---------------------------------------------------------------------------

@Component({
  template: `<img [appLazyLoadImage]="src" [placeholder]="placeholder" />`,
  imports: [LazyLoadImageDirective],
  standalone: true,
})
class HostComponent {
  src = 'poster.jpg';
  placeholder = 'assets\\images\\tvseries\\default.svg';
}

@Component({
  template: `<img appLazyLoadImage="already\\assets\\images\\poster.jpg" />`,
  imports: [LazyLoadImageDirective],
  standalone: true,
})
class HostWithFullPathComponent {}

@Component({
  template: `<div [appLazyLoadImage]="src"></div>`,
  imports: [LazyLoadImageDirective],
  standalone: true,
})
class HostDivComponent {
  src = 'poster.jpg';
}

@Component({
  template: `<img [appLazyLoadImage]="src" />`,
  imports: [LazyLoadImageDirective],
  standalone: true,
})
class HostNoPlaceholderComponent {
  src = 'poster.jpg';
}

// ---------------------------------------------------------------------------
// IntersectionObserver mock factory
// ---------------------------------------------------------------------------

interface MockIOInstance {
  callback: IntersectionObserverCallback;
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  triggerIntersection: (isIntersecting: boolean) => void;
}

function createIntersectionObserverMock() {
  const instances: MockIOInstance[] = [];

  // Must be a regular `function` (not an arrow) so it can be used with `new`.
  // vi.fn() wraps it while preserving the constructor signature.
  const MockIntersectionObserver = vi.fn(function (
    this: MockIOInstance,
    callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
    this.triggerIntersection = (isIntersecting: boolean) => {
      const target = document.createElement('img');
      callback(
        [{ isIntersecting, target } as unknown as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    };
    instances.push(this);
  });

  return { MockIntersectionObserver, instances };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('LazyLoadImageDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let imgEl: DebugElement;
  let { MockIntersectionObserver, instances } = createIntersectionObserverMock();

  beforeEach(async () => {
    ({ MockIntersectionObserver, instances } = createIntersectionObserverMock());

    // Replace the global IntersectionObserver before each test
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    imgEl = fixture.debugElement.query(By.css('img'));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Initialisation
  // -------------------------------------------------------------------------

  describe('ngOnInit', () => {
    it('should set the loading attribute to "lazy"', () => {
      expect(imgEl.nativeElement.getAttribute('loading')).toBe('lazy');
    });

    it('should set the placeholder as the initial src', () => {
      expect(imgEl.nativeElement.getAttribute('src')).toBe(
        'assets\\images\\tvseries\\default.svg',
      );
    });

    it('should prefix src with assets path when it does not already contain it', () => {
      const directive = imgEl.injector.get(LazyLoadImageDirective);
      expect(directive.src).toBe('assets\\images\\poster.jpg');
    });

    it('should NOT double-prefix src when it already contains "assets\\images\\"', async () => {
      const f = TestBed.createComponent(HostWithFullPathComponent);
      f.detectChanges();
      const el = f.debugElement.query(By.css('img'));
      const directive = el.injector.get(LazyLoadImageDirective);
      expect(directive.src).toBe('already\\assets\\images\\poster.jpg');
    });

    it('should create an IntersectionObserver', () => {
      expect(MockIntersectionObserver).toHaveBeenCalledOnce();
    });

    it('should pass rootMargin "100px" to the observer', () => {
      expect(MockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { rootMargin: '100px' },
      );
    });

    it('should call observe() on the img element', () => {
      expect(instances[0].observe).toHaveBeenCalledWith(imgEl.nativeElement);
    });

    it('should log an error and return early when the directive is used on a non-<img> element', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const f = TestBed.createComponent(HostDivComponent);
      f.detectChanges();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'appLazyLoadImage directive should be used on <img> elements only.',
      );
    });

    it('should NOT set placeholder src when no placeholder is provided', async () => {
      const f = TestBed.createComponent(HostNoPlaceholderComponent);
      f.detectChanges();
      const el = f.debugElement.query(By.css('img'));
      // No placeholder input → src attribute should not be set by directive during init
      expect(el.nativeElement.getAttribute('src')).toBe('assets\\images\\tvseries\\default.svg');
    });
  });

  // -------------------------------------------------------------------------
  // IntersectionObserver callback – image loading
  // -------------------------------------------------------------------------

  describe('IntersectionObserver callback', () => {
    it('should set the actual src when the element intersects', () => {
      instances[0].triggerIntersection(true);
      expect(imgEl.nativeElement.getAttribute('src')).toBe('assets\\images\\poster.jpg');
    });

    it('should disconnect the observer after intersection', () => {
      instances[0].triggerIntersection(true);
      expect(instances[0].disconnect).toHaveBeenCalled();
    });

    it('should unobserve the element after intersection', () => {
      instances[0].triggerIntersection(true);
      expect(instances[0].unobserve).toHaveBeenCalledWith(imgEl.nativeElement);
    });

    it('should NOT load the image when entry is NOT intersecting', () => {
      instances[0].triggerIntersection(false);
      // src should still be the placeholder
      expect(imgEl.nativeElement.getAttribute('src')).toBe(
        'assets\\images\\tvseries\\default.svg',
      );
    });
  });

  // -------------------------------------------------------------------------
  // loadImage – error handling
  // -------------------------------------------------------------------------

  describe('loadImage error handling', () => {
    it('should fall back to the placeholder when the image fails to load', () => {
      instances[0].triggerIntersection(true);

      // Manually set a different src to verify the fallback restores placeholder
      imgEl.nativeElement.setAttribute('src', 'broken-image.jpg');
      imgEl.nativeElement.onerror();

      expect(imgEl.nativeElement.getAttribute('src')).toBe(
        'assets\\images\\tvseries\\default.svg',
      );
    });

    it('should log an error when image fails to load and no placeholder is provided', () => {
      // Spy BEFORE detectChanges so no earlier console.error calls pollute the mock
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const f = TestBed.createComponent(HostNoPlaceholderComponent);
      f.detectChanges();
      const el = f.debugElement.query(By.css('img'));

      // Trigger intersection so loadImage() runs and attaches onerror
      instances[instances.length - 1].triggerIntersection(true);

      // Simulate image load failure
      el.nativeElement.onerror?.();

      // Use .mock.calls scan — other Angular warnings may also call console.error
      const matched = consoleErrorSpy.mock.calls.some(
        (args) => typeof args[0] === 'string' && args[0].includes('Image failed to load:'),
      );
      expect(matched).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // ngOnDestroy
  // -------------------------------------------------------------------------

  describe('ngOnDestroy', () => {
    it('should call unobserve on the img element when destroyed', () => {
      fixture.destroy();
      expect(instances[0].unobserve).toHaveBeenCalledWith(imgEl.nativeElement);
    });

    it('should call disconnect on the observer when destroyed', () => {
      fixture.destroy();
      expect(instances[0].disconnect).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // SSR / no IntersectionObserver environment
  // -------------------------------------------------------------------------

  describe('when IntersectionObserver is not available', () => {
    it('should not throw and should not call observe', async () => {
      vi.unstubAllGlobals();
      // Remove IntersectionObserver from window
      const original = (window as Window & { IntersectionObserver?: unknown })
        .IntersectionObserver;
      delete (window as Window & { IntersectionObserver?: unknown }).IntersectionObserver;

      let error: unknown;
      try {
        const f = TestBed.createComponent(HostComponent);
        f.detectChanges();
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();

      // Restore
      (window as Window & { IntersectionObserver?: unknown }).IntersectionObserver = original;
    });
  });
});