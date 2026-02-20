import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modal } from './modal';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal]
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default modal id', () => {
    expect(component.modalId).toBe('mymodal');
  });

  it('should accept custom modal id', () => {
    component.modalId = 'customModal';
    fixture.detectChanges();

    expect(component.modalId).toBe('customModal');
  });

  it('should accept modal title', () => {
    component.modalTitle = 'Test Modal Title';
    fixture.detectChanges();

    expect(component.modalTitle).toBe('Test Modal Title');
  });

  it('should accept modal content', () => {
    component.modalContent = 'Test Modal Content';
    fixture.detectChanges();

    expect(component.modalContent).toBe('Test Modal Content');
  });

  it('should handle multiple modal instances', () => {
    const component1 = fixture.componentInstance;
    const fixture2 = TestBed.createComponent(Modal);
    const component2 = fixture2.componentInstance;

    component1.modalId = 'modal1';
    component2.modalId = 'modal2';

    expect(component1.modalId).not.toBe(component2.modalId);
  });

  it('should render modal selector', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-modal')).toBeTruthy();
  });
});
