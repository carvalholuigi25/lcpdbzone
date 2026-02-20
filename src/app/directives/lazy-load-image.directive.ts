// lazy-load-image.directive.ts

import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLazyLoadImage]'
})
export class LazyLoadImageDirective implements OnInit, OnDestroy {
  @Input('appLazyLoadImage') src!: string; // Actual image URL
  @Input() placeholder: string = 'assets\\images\\tvseries\\default.svg';       // Optional placeholder image

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLImageElement>, private renderer: Renderer2) {}


  ngOnInit(): void {
    const imgElement = this.el.nativeElement;

    // Set placeholder if provided
    if (this.placeholder) {
      this.renderer.setAttribute(imgElement, 'src', this.placeholder);
    }

    // Ensure the element is an <img>
    if (imgElement.tagName !== 'IMG') {
      console.error('appLazyLoadImage directive should be used on <img> elements only.');
      return;
    }

    // Create Intersection Observer
     if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage();
            this.observer?.disconnect();
          }
        });
      }, { rootMargin: '100px' }); // Preload before fully in view

      this.observer.observe(imgElement);
    }
  }

  private loadImage(): void {
    if (this.src) {
      const imgEl = this.el.nativeElement;

      // Set up error handling
      imgEl.onerror = () => {
        if (this.placeholder) {
          this.renderer.setAttribute(imgEl, 'src', this.placeholder);
        } else {
          console.error(`Image failed to load: ${this.src}`);
        }
      };

      // Set the actual image source
      this.renderer.setAttribute(imgEl, 'src', this.src);
      // this.renderer.setAttribute(this.el.nativeElement, 'src', this.src);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}