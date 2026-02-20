import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterSticky } from './footersticky';
import { describe, it, expect, beforeEach } from 'vitest';

describe('FooterSticky', () => {
  let component: FooterSticky;
  let fixture: ComponentFixture<FooterSticky>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterSticky]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterSticky);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.year).toBe(currentYear);
  });

  it('should have correct email', () => {
    expect(component.mail).toBe('luiscarvalho239@gmail.com');
  });

  it('should have same year and email as Footer component', () => {
    // FooterSticky should have the same properties as Footer
    expect(component.year).toEqual(new Date().getFullYear());
    expect(component.mail).toEqual('luiscarvalho239@gmail.com');
  });
});
