import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAnimes } from './update-animes';

describe('UpdateAnimes', () => {
  let component: UpdateAnimes;
  let fixture: ComponentFixture<UpdateAnimes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAnimes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAnimes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
