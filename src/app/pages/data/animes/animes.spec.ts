import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Animes } from './animes';

describe('Animes', () => {
  let component: Animes;
  let fixture: ComponentFixture<Animes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Animes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Animes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
