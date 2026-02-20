import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTvseries } from './update-tvseries';

describe('UpdateTvseries', () => {
  let component: UpdateTvseries;
  let fixture: ComponentFixture<UpdateTvseries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTvseries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTvseries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
