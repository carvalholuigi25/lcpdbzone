import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnimes } from './create-animes';

describe('CreateAnimes', () => {
  let component: CreateAnimes;
  let fixture: ComponentFixture<CreateAnimes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAnimes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAnimes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
