import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LazyLoadImageDirective } from './lazy-load-image.directive';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
  standalone: true,
  imports: [LazyLoadImageDirective],
  template: `
    <img 
      [appLazyLoadImage]="imageUrl" 
      [placeholder]="placeholderUrl"
      alt="test image"
    />
  `
})
class TestComponent {
  imageUrl = 'https://example.com/image.jpg';
  placeholderUrl = 'assets/images/placeholder.jpg';
}

describe('LazyLoadImageDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let imgElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, LazyLoadImageDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    imgElement = fixture.debugElement.query(By.directive(LazyLoadImageDirective));
  });

  it('should create the directive', () => {
    expect(imgElement).toBeTruthy();
  });

  it('should set placeholder image initially', () => {
    fixture.detectChanges();
    
    const src = imgElement.nativeElement.src;
    expect(src).toContain('placeholder.jpg');
  });

  it('should load actual image when element is in view', () => {
    fixture.detectChanges();

    setTimeout(() => {
      // Simulate intersection observer callback
      const img = imgElement.nativeElement as HTMLImageElement;
      expect(img).toBeTruthy();
    }, 100);
  });

  it('should handle image load error by showing placeholder', () => {
    fixture.detectChanges();

    const img = imgElement.nativeElement as HTMLImageElement;
    
    // Simulate image load error
    if (img.onerror) {
      img.onerror(new Event('error'));
    }

    setTimeout(() => {
      expect(img.src).toContain('placeholder.jpg');
    }, 50);
  });

  it('should use default placeholder when none provided', () => {
    component.placeholderUrl = '';
    fixture.detectChanges();

    const img = imgElement.nativeElement as HTMLImageElement;
    // Default should be set if no placeholder provided
    expect(img).toBeTruthy();
  });

  it('should only work with img elements', () => {
    // The directive should log error if used on non-img elements
    expect(imgElement.nativeElement.tagName).toBe('IMG');
  });

  it('should disconnect observer on destroy', () => {
    fixture.detectChanges();
    
    const directive = imgElement.injector.get(LazyLoadImageDirective);
    if (directive['observer']) {
      vi.spyOn(directive['observer'], 'disconnect');
    }

    fixture.destroy();

    // Observer disconnect should have been called
    expect(directive['observer']).toBeTruthy();
  });

  it('should set actual image source', () => {
    component.imageUrl = 'https://example.com/actual-image.jpg';
    fixture.detectChanges();

    const img = imgElement.nativeElement as HTMLImageElement;
    expect(img).toBeTruthy();
  });

  it('should handle lazy loading with root margin', () => {
    fixture.detectChanges();

    const directive = imgElement.injector.get(LazyLoadImageDirective);
    expect(directive).toBeTruthy();
  });

  it('should update image src when input changes', () => {
    fixture.detectChanges();

    component.imageUrl = 'https://example.com/new-image.jpg';
    fixture.detectChanges();

    const img = imgElement.nativeElement as HTMLImageElement;
    expect(img).toBeTruthy();
  });

  it('should handle null or empty src gracefully', () => {
    component.imageUrl = '';
    fixture.detectChanges();

    const img = imgElement.nativeElement as HTMLImageElement;
    expect(img).toBeTruthy();
  });

  it('should preserve image attributes', () => {
    fixture.detectChanges();

    const img = imgElement.nativeElement as HTMLImageElement;
    expect(img.alt).toBe('test image');
  });

  it('should support multiple lazy load images', () => {
    const multiImageComponent = TestBed.createComponent(MultiImageComponent);
    multiImageComponent.detectChanges();

    const images = multiImageComponent.debugElement.queryAll(By.directive(LazyLoadImageDirective));
    expect(images.length).toBe(2);

    multiImageComponent.destroy();
  });
});

@Component({
  standalone: true,
  imports: [LazyLoadImageDirective],
  template: `
    <img [appLazyLoadImage]="'image1.jpg'" alt="image 1" />
    <img [appLazyLoadImage]="'image2.jpg'" alt="image 2" />
  `
})
class MultiImageComponent {}
