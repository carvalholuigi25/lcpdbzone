import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Loading } from './loading';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Loading', () => {
  let component: Loading;
  let fixture: ComponentFixture<Loading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loading]
    }).compileComponents();

    fixture = TestBed.createComponent(Loading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render loading component', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-loading')).toBeTruthy();
  });

  it('should have selector app-loading', () => {
    expect(component).toBeTruthy();
  });
});
