import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Modal } from './modal';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal],
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Default input values', () => {
    it('should have "mymodal" as the default modalId', () => {
      expect(component.modalId).toBe('mymodal');
    });

    it('should have modalTitle undefined by default', () => {
      expect(component.modalTitle).toBeUndefined();
    });

    it('should have modalContent undefined by default', () => {
      expect(component.modalContent).toBeUndefined();
    });
  });

  describe('@Input() modalId', () => {
    it('should accept a custom modalId', () => {
      component.modalId = 'custom-modal';
      fixture.componentRef.setInput('modalId', component.modalId);
      fixture.detectChanges();

      expect(component.modalId).toBe('custom-modal');
    });

    it('should reflect the updated modalId in the component', () => {
      const newId = 'updated-modal-id';
      component.modalId = newId;
      fixture.componentRef.setInput('modalId', component.modalId);
      fixture.detectChanges();

      expect(component.modalId).toBe(newId);
    });
  });

  describe('@Input() modalTitle', () => {
    it('should accept and store a modalTitle value', () => {
      component.modalTitle = 'Test Title';
      fixture.componentRef.setInput('modalTitle', component.modalTitle);
      fixture.detectChanges();

      expect(component.modalTitle).toBe('Test Title');
    });

    it('should update when modalTitle input changes', () => {
      component.modalTitle = 'Initial Title';
      fixture.componentRef.setInput('modalTitle', component.modalTitle);
      fixture.detectChanges();
      expect(component.modalTitle).toBe('Initial Title');

      component.modalTitle = 'Updated Title';
      fixture.componentRef.setInput('modalTitle', component.modalTitle);
      fixture.detectChanges();
      expect(component.modalTitle).toBe('Updated Title');
    });
  });

  describe('@Input() modalContent', () => {
    it('should accept and store a modalContent value', () => {
      component.modalContent = 'Some content here';
      fixture.componentRef.setInput('modalContent', component.modalContent);
      fixture.detectChanges();

      expect(component.modalContent).toBe('Some content here');
    });

    it('should update when modalContent input changes', () => {
      component.modalContent = 'Initial content';
      fixture.componentRef.setInput('modalContent', component.modalContent);
      fixture.detectChanges();
      expect(component.modalContent).toBe('Initial content');

      component.modalContent = 'Updated content';
      fixture.componentRef.setInput('modalContent', component.modalContent);
      fixture.detectChanges();
      expect(component.modalContent).toBe('Updated content');
    });

    it('should handle multiline content', () => {
      const multiline = 'Line one\nLine two\nLine three';
      component.modalContent = multiline;
      fixture.componentRef.setInput('modalContent', component.modalContent);
      fixture.detectChanges();

      expect(component.modalContent).toBe(multiline);
    });
  });

  describe('Input combinations', () => {
    it('should handle all inputs set simultaneously', () => {
      component.modalId = 'combo-modal';
      component.modalTitle = 'Combo Title';
      component.modalContent = 'Combo Content';
      fixture.componentRef.setInput('modalId', component.modalId);
      fixture.componentRef.setInput('modalTitle', component.modalTitle);
      fixture.componentRef.setInput('modalContent', component.modalContent);
      fixture.detectChanges();

      expect(component.modalId).toBe('combo-modal');
      expect(component.modalTitle).toBe('Combo Title');
      expect(component.modalContent).toBe('Combo Content');
    });

    it('should preserve modalId default when only title and content are set', () => {
      component.modalTitle = 'Only Title';
      component.modalContent = 'Only Content';
      fixture.componentRef.setInput('modalTitle', component.modalTitle);
      fixture.componentRef.setInput('modalContent', component.modalContent);
      fixture.detectChanges();

      expect(component.modalId).toBe('mymodal');
    });
  });
});