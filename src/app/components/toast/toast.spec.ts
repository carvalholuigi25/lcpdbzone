import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { ToastService } from '../../services/toast.service';
import { Toast } from '../../components';
// import '../../../test-setup';

beforeAll(async () => {
    try {
      if (typeof process !== 'undefined' && process.versions?.node) {
        const { readFileSync } = await import('node:fs');
        const { ɵresolveComponentResources: resolveComponentResources } =
          await import('@angular/core');

        await resolveComponentResources(url =>
          Promise.resolve(readFileSync(new URL(url, import.meta.url), 'utf-8'))
        );
      }
    } catch {
      return;
    }
  });

describe('Toast', () => {
  let component: Toast;
  let toastServiceMock: Partial<ToastService>;
  let cdr: ChangeDetectorRef;
  let cdrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    toastServiceMock = {};

    await TestBed.configureTestingModule({
      imports: [Toast],
      providers: [{ provide: ToastService, useValue: toastServiceMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    cdr = (component as any).cdr;
    cdrSpy = vi.spyOn(cdr, 'markForCheck');
    fixture.detectChanges();
    cdrSpy.mockClear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have toastService injected', () => {
    expect(component.toastService).toBeDefined();
  });

  it('should call cdr.markForCheck() on ngOnInit', () => {
    component.ngOnInit();

    expect(cdrSpy).toHaveBeenCalledTimes(1);
  });

  it('should call cdr.markForCheck() only once per ngOnInit call', () => {
    component.ngOnInit();
    component.ngOnInit();

    expect(cdrSpy).toHaveBeenCalledTimes(2);
  });
});